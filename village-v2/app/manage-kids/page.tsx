'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPocketBase } from '@/lib/pocketbase';
import { Child, Course, PortfolioItem, SchoolYear, SchoolBreak } from '@/lib/types';
import { getExpectedLesson } from '@/lib/calendar-utils';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LoadingScreen } from '@/components/ui/Spinner';
import { Toast } from '@/components/ui/Toast';

export default function ManageKidsPage() {
  const router = useRouter();
  const pb = getPocketBase();
  
  const [kids, setKids] = useState<Child[]>([]);
  const [selectedKid, setSelectedKid] = useState<Child | null>(null);
  const [isKidModalOpen, setIsKidModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingKid, setEditingKid] = useState<Child | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'portfolio'>('overview');
  const [scheduleDay, setScheduleDay] = useState('Mon');
  const [loading, setLoading] = useState(true);
  const [schoolYear, setSchoolYear] = useState<SchoolYear | null>(null);
  const [breaks, setBreaks] = useState<SchoolBreak[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Form states
  const [kidName, setKidName] = useState('');
  const [kidAge, setKidAge] = useState('');
  const [kidGrade, setKidGrade] = useState('Kindergarten');
  const [kidFocus, setKidFocus] = useState('');
  
  const [courseName, setCourseName] = useState('');
  const [totalLessons, setTotalLessons] = useState('180');
  const [currentLesson, setCurrentLesson] = useState('1');
  const [activeDays, setActiveDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioSubject, setPortfolioSubject] = useState('');
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push('/');
      return;
    }
    
    let isMounted = true;
    
    const loadKidsAsync = async () => {
      if (!isMounted) return;
      try {
        const userId = pb.authStore.model?.id;
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          const records = await pb.collection('children').getFullList({
            filter: `user = "${userId}"`,
            sort: 'name'
          });
          
          if (!isMounted) return;
          
          // Load courses for each child
          const kidsWithCourses = await Promise.all(
            records.map(async (kid) => {
              try {
                const courses = await pb.collection('courses').getFullList({
                  filter: `child = "${kid.id}"`,
                  sort: 'name'
                });
                return { ...kid, courses } as unknown as Child;
              } catch {
                return { ...kid, courses: [] } as unknown as Child;
              }
            })
          );
          
          if (isMounted) {
            setKids(kidsWithCourses);
            
            // Load school year and breaks
            try {
              const years = await pb.collection('school_years').getFullList({
                filter: `user = "${userId}"`,
                sort: '-start_date',
                limit: 1
              });
              if (years.length > 0) {
                setSchoolYear(years[0] as unknown as SchoolYear);
                const breakRecords = await pb.collection('school_breaks').getFullList({
                  filter: `school_year = "${years[0].id}"`
                });
                setBreaks(breakRecords as unknown as SchoolBreak[]);
              }
            } catch (e) {
              console.warn('Calendar data failed to load');
            }

            setLoading(false);
          }
        } catch (error: any) {
          // Handle permission errors gracefully
          if (error?.status === 403 || error?.status === 0) {
            console.warn('Kids permission issue:', error?.message);
            if (isMounted) {
              setKids([]);
              setLoading(false);
            }
          } else {
            throw error;
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Kids load error:', error);
          setKids([]);
          setLoading(false);
        }
      }
    };
    
    loadKidsAsync();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const loadKids = async () => {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      try {
        const records = await pb.collection('children').getFullList({
          filter: `user = "${userId}"`,
          sort: 'name'
        });
        
        // Load courses for each child
        const kidsWithCourses = await Promise.all(
          records.map(async (kid) => {
            try {
              const courses = await pb.collection('courses').getFullList({
                filter: `child = "${kid.id}"`,
                sort: 'name'
              });
              return { ...kid, courses } as unknown as Child;
            } catch {
              return { ...kid, courses: [] } as unknown as Child;
            }
          })
        );
        
        setKids(kidsWithCourses);
      } catch (error: any) {
        // Handle permission errors gracefully
        if (error?.status === 403 || error?.status === 0) {
          console.warn('Kids permission issue:', error?.message);
          setKids([]);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Kids load error:', error);
      setKids([]);
    }
  };

  const handleLogout = () => {
    pb.authStore.clear();
    router.push('/');
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!selectedKid) return;

      const formData = new FormData();
      formData.append('child', selectedKid.id);
      formData.append('title', portfolioTitle);
      formData.append('subject', portfolioSubject);
      formData.append('date', new Date().toISOString());
      if (portfolioFile) {
        formData.append('image', portfolioFile);
      }

      await pb.collection('portfolio').create(formData);
      
      // Create activity log
      try {
        const userId = pb.authStore.model?.id;
        if (userId && selectedKid) {
          await pb.collection('activity_logs').create({
            user: userId,
            child: selectedKid.id,
            type: 'portfolio_add',
            title: `Added "${portfolioTitle}" to portfolio`,
            date: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('Activity log failed:', e);
      }

      setToast({ message: 'Project saved to portfolio!', type: 'success' });
      setIsPortfolioModalOpen(false);
      setPortfolioTitle('');
      setPortfolioSubject('');
      setPortfolioFile(null);
      loadPortfolio(selectedKid.id);
    } catch (error) {
      console.error('Portfolio save error:', error);
      setToast({ message: 'Failed to save. Portfolio collection might not be ready.', type: 'error' });
    }
  };

  const openKidModal = (kid?: Child) => {
    if (kid) {
      setEditingKid(kid);
      setKidName(kid.name);
      setKidAge(kid.age.toString());
      setKidGrade(kid.grade || 'Kindergarten');
      setKidFocus(kid.focus || '');
    } else {
      setEditingKid(null);
      setKidName('');
      setKidAge('');
      setKidGrade('Kindergarten');
      setKidFocus('');
    }
    setIsKidModalOpen(true);
  };

  const handleSaveKid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      const data = {
        user: userId,
        name: kidName,
        age: parseInt(kidAge),
        grade: kidGrade,
        focus: kidFocus
      };

      if (editingKid) {
        await pb.collection('children').update(editingKid.id, data);
        setToast({ message: `${kidName} updated!`, type: 'success' });
      } else {
        await pb.collection('children').create(data);
        setToast({ message: `${kidName} added!`, type: 'success' });
      }

      setIsKidModalOpen(false);
      setKidName('');
      setKidAge('');
      setKidGrade('Kindergarten');
      setKidFocus('');
      setEditingKid(null);
      loadKids();
    } catch (error) {
      console.error('Save kid error:', error);
      setToast({ message: 'Failed to save. Please try again.', type: 'error' });
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!selectedKid) return;

      await pb.collection('courses').create({
        child: selectedKid.id,
        name: courseName,
        total_lessons: parseInt(totalLessons),
        current_lesson: parseInt(currentLesson),
        active_days: activeDays.join(',')
      });

      setIsCourseModalOpen(false);
      setCourseName('');
      setTotalLessons('180');
      setCurrentLesson('1');
      
      // Reload kids and update selectedKid with fresh data
      const userId = pb.authStore.model?.id;
      if (userId) {
        const records = await pb.collection('children').getFullList({
          filter: `user = "${userId}"`,
          sort: 'name'
        });
        
        const kidsWithCourses = await Promise.all(
          records.map(async (kid) => {
            try {
              const courses = await pb.collection('courses').getFullList({
                filter: `child = "${kid.id}"`,
                sort: 'name'
              });
              return { ...kid, courses } as unknown as Child;
            } catch {
              return { ...kid, courses: [] } as unknown as Child;
            }
          })
        );
        
        setKids(kidsWithCourses);
        
        // Update selectedKid with the refreshed data
        const updatedKid = kidsWithCourses.find(k => k.id === selectedKid.id);
        if (updatedKid) {
          setSelectedKid(updatedKid);
        }
      }
      setToast({ message: `${courseName} added!`, type: 'success' });
    } catch (error) {
      console.error('Save course error:', error);
      setToast({ message: 'Failed to add course. Please try again.', type: 'error' });
    }
  };

  const handleMarkComplete = async (courseId: string, current: number, total: number) => {
    try {
      if (current >= total) {
        setToast({ message: 'Course already complete!', type: 'success' });
        return;
      }

      await pb.collection('courses').update(courseId, {
        current_lesson: current + 1,
        last_lesson_date: new Date().toISOString().split('T')[0]
      });

      // Create activity log
      try {
        const userId = pb.authStore.model?.id;
        if (userId && selectedKid) {
          const course = selectedKid.courses?.find(c => c.id === courseId);
          await pb.collection('activity_logs').create({
            user: userId,
            child: selectedKid.id,
            type: 'lesson_complete',
            title: `Completed ${course?.name} Lesson ${current}`,
            date: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn('Activity log failed:', e);
      }

      setToast({ message: 'Lesson recorded!', type: 'success' });
      
      // Update the local state for immediate feedback
      if (selectedKid && selectedKid.courses) {
        const updatedCourses = selectedKid.courses.map(c => 
          c.id === courseId ? { ...c, current_lesson: current + 1 } : c
        );
        setSelectedKid({ ...selectedKid, courses: updatedCourses });
        
        // Also update the main kids list
        setKids(prevKids => prevKids.map(k => 
          k.id === selectedKid.id ? { ...k, courses: updatedCourses } : k
        ));
      }
    } catch (error) {
      console.error('Mark complete error:', error);
      setToast({ message: 'Failed to update. Please try again.', type: 'error' });
    }
  };

  const loadPortfolio = async (kidId: string) => {
    try {
      const records = await pb.collection('portfolio').getFullList({
        filter: `child = "${kidId}"`,
        sort: '-date'
      });
      setPortfolioItems(records as unknown as PortfolioItem[]);
    } catch (error) {
      console.warn('Portfolio load error (expected if collection not created):', error);
      setPortfolioItems([]);
    }
  };

  const openVault = (kid: Child) => {
    setSelectedKid(kid);
    setActiveTab('overview');
    loadPortfolio(kid.id);
  };

  const closeVault = () => {
    setSelectedKid(null);
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Get dates for current week (Mon-Fri)
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const fullNames: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
    
    return days.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return {
        short: day,
        full: fullNames[day],
        date: `${date.getMonth() + 1}/${date.getDate()}`
      };
    });
  };

  const weekDates = getWeekDates();

  const getAgeColorClass = (age: number) => {
    if (age >= 13) return 'terracotta';
    if (age >= 9) return 'mustard';
    return 'sage';
  };

  if (loading) {
    return (
      <>
        <Header showLogout onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto my-12 px-8">
          <LoadingScreen message="Loading family profiles..." />
        </main>
      </>
    );
  }

  return (
    <>
      <Header showLogout onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto my-12 px-8 pb-20 animate-fade-in">
        {!selectedKid ? (
          <div>
            <div className="flex justify-between items-center mb-12 flex-wrap gap-4">
              <div>
                <h2 className="font-display text-5xl font-extrabold tracking-tight mb-2">Family Profiles</h2>
                <p className="text-text-muted">Manage your children&apos;s personalized learning journeys.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => router.push('/profile')}>
                  🏠 Parent Home
                </Button>
                <Button onClick={() => openKidModal()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Child
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {kids.map((kid) => (
                <div 
                  key={kid.id}
                  className={`bg-card rounded-[2rem] p-10 shadow-[0_10px_30px_-10px_rgba(75,99,68,0.12)] border border-border transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(75,99,68,0.2)] hover:border-primary-light relative overflow-hidden flex flex-col before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-1.5 before:rounded-t-3xl ${
                    kid.age >= 13 ? 'before:bg-secondary' : kid.age >= 9 ? 'before:bg-accent' : 'before:bg-primary-light'
                  }`}
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-bg-alt flex items-center justify-center font-display text-2xl text-primary font-extrabold border-2 border-border">
                      {getInitial(kid.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="m-0 font-display text-2xl font-bold text-text">{kid.name}</h3>
                      <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-bg-alt text-primary-dark inline-block mt-1">
                        Age {kid.age} • {kid.grade}
                      </span>
                    </div>
                  </div>

                  {kid.courses && kid.courses.length > 0 && (
                    <div className="mb-8">
                      <ProgressBar
                        label={kid.courses[0].name}
                        percentage={(kid.courses[0].current_lesson / kid.courses[0].total_lessons) * 100}
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => openVault(kid)}
                      className="flex-1 h-11 rounded-xl flex items-center justify-center border border-border bg-bg cursor-pointer transition-all hover:bg-white hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(75,99,68,0.12)] text-text-muted hover:text-primary"
                      title="Open Learning Vault"
                    >
                      📚
                    </button>
                    <button
                      onClick={() => openKidModal(kid)}
                      className="flex-1 h-11 rounded-xl flex items-center justify-center border border-border bg-bg cursor-pointer transition-all hover:bg-white hover:border-primary hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(75,99,68,0.12)] text-text-muted hover:text-primary"
                      title="Edit Profile"
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                  {selectedKid.name}&apos;s Learning Vault
                </h2>
                <p className="text-text-muted">Stored resources and progress.</p>
              </div>
              <Button variant="ghost" onClick={closeVault}>← Back</Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mb-12 border-b-2 border-border">
              <button
                className={`font-body font-bold text-base px-0 py-4 border-b-4 rounded-none transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'text-primary border-primary'
                    : 'text-text-muted border-transparent hover:text-primary'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`font-body font-bold text-base px-0 py-4 border-b-4 rounded-none transition-all cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'text-primary border-primary'
                    : 'text-text-muted border-transparent hover:text-primary'
                }`}
                onClick={() => setActiveTab('schedule')}
              >
                📅 Weekly Schedule
              </button>
              <button
                className={`font-body font-bold text-base px-0 py-4 border-b-4 rounded-none transition-all cursor-pointer ${
                  activeTab === 'portfolio'
                    ? 'text-primary border-primary'
                    : 'text-text-muted border-transparent hover:text-primary'
                }`}
                onClick={() => setActiveTab('portfolio')}
              >
                🎨 Portfolio
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <div className="mb-12">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-2xl font-extrabold m-0">Course Progress</h3>
                    <Button size="sm" variant="ghost" onClick={() => setIsCourseModalOpen(true)}>
                      + Add Course
                    </Button>
                  </div>

                  {selectedKid.courses && selectedKid.courses.length > 0 ? (
                    <div className="space-y-6">
                      {selectedKid.courses.map((course) => {
                        const mapping = schoolYear ? getExpectedLesson(course, schoolYear, breaks) : null;
                        
                        return (
                          <div key={course.id} className="bg-card p-6 rounded-[1.25rem] border border-border">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1 mr-4">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-display font-bold m-0">{course.name}</h4>
                                  {mapping && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                      mapping.status === 'ahead' ? 'bg-green-100 text-green-700' :
                                      mapping.status === 'behind' ? 'bg-red-100 text-red-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {mapping.status === 'on-track' ? 'On Track' : `${mapping.diff} Lessons ${mapping.status}`}
                                    </span>
                                  )}
                                </div>
                                <ProgressBar
                                  label={`Lesson ${course.current_lesson} of ${course.total_lessons}`}
                                  percentage={(course.current_lesson / course.total_lessons) * 100}
                                />
                                {mapping && (
                                  <p className="text-[10px] text-text-muted mt-2 m-0">
                                    Expected: Lesson {mapping.expectedLesson}
                                  </p>
                                )}
                              </div>
                              <Button 
                                size="sm" 
                                variant={course.current_lesson > course.total_lessons ? 'ghost' : 'outline'}
                                disabled={course.current_lesson > course.total_lessons}
                                onClick={() => handleMarkComplete(course.id, course.current_lesson, course.total_lessons)}
                              >
                                {course.current_lesson > course.total_lessons ? '✓ Done' : 'Next Lesson →'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-bg-alt rounded-[1.25rem] border border-border">
                      <p className="text-text-muted text-sm">
                        No courses tracked yet. Add one to start monitoring progress.
                      </p>
                    </div>
                  )}
                </div>

                <h3 className="font-display text-2xl font-extrabold mb-6">Resource Vault</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: '📖', title: 'Reading Logs', count: '12 entries this month' },
                    { icon: '🎨', title: 'Portfolio', count: '8 saved projects' },
                    { icon: '🧪', title: 'Science Lab', count: '3 pending reports' },
                    { icon: '🏆', title: 'Badges', count: '5 achievements' }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-card p-6 rounded-[1.25rem] border border-border flex items-center gap-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_20px_40px_-15px_rgba(75,99,68,0.2)] cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-xl bg-bg-alt flex items-center justify-center text-primary text-xl border border-border">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="m-0 font-display text-base">{item.title}</h4>
                        <p className="text-xs m-0 mt-1 text-text-muted">{item.count}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <>
                {/* Mobile: Tabbed days */}
                <div className="sm:hidden">
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {weekDates.map((day) => (
                      <button
                        key={day.short}
                        onClick={() => setScheduleDay(day.short)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                          scheduleDay === day.short
                            ? 'bg-primary text-white'
                            : 'bg-bg-alt text-text-muted hover:bg-border'
                        }`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                  <div className="bg-bg-alt p-4 rounded-[1.25rem] border border-border min-h-[200px]">
                    <h5 className="font-display uppercase tracking-wider text-sm mt-0 mb-4">
                      {weekDates.find(d => d.short === scheduleDay)?.full} {weekDates.find(d => d.short === scheduleDay)?.date}
                    </h5>
                    {(() => {
                      const dayCourses = selectedKid?.courses?.filter(c => 
                        c.current_lesson <= c.total_lessons && 
                        (!c.active_days || c.active_days.split(',').includes(scheduleDay))
                      ) || [];

                      return dayCourses.length > 0 ? (
                        <div className="space-y-3">
                          {dayCourses.map((course, idx) => (
                            <div 
                              key={course.id} 
                              className={`bg-white p-3 rounded-lg text-sm border-l-4 ${
                                idx % 2 === 0 ? 'border-primary' : 'border-secondary'
                              }`}
                            >
                              <div className="font-semibold">{course.name}</div>
                              <div className="text-text-muted text-xs mt-1">Lesson {course.current_lesson} of {course.total_lessons}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-text-muted text-sm">No courses scheduled. Add courses to see them here.</p>
                      );
                    })()}
                  </div>
                </div>

                {/* Desktop: Grid view */}
                <div className="hidden sm:grid grid-cols-5 gap-6">
                  {weekDates.map((day) => (
                    <div key={day.short} className="bg-bg-alt p-4 rounded-[1.25rem] border border-border">
                      <h5 className="font-display uppercase tracking-wider text-sm mt-0">{day.short} {day.date}</h5>
                      {(() => {
                        const dayCourses = selectedKid?.courses?.filter(c => 
                          c.current_lesson <= c.total_lessons && 
                          (!c.active_days || c.active_days.split(',').includes(day.short))
                        ) || [];
                        
                        return dayCourses.length > 0 ? (
                          <div className="space-y-2 mt-4">
                            {dayCourses.map((course, idx) => (
                              <div 
                                key={course.id} 
                                className={`bg-white p-3 rounded-lg text-sm border-l-4 ${
                                  idx % 2 === 0 ? 'border-primary' : 'border-secondary'
                                }`}
                              >
                                <div className="font-semibold text-xs">{course.name}</div>
                                <div className="text-text-muted text-[10px] mt-1">L{course.current_lesson}/{course.total_lessons}</div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-text-muted text-xs mt-4">No courses scheduled</p>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div 
                  onClick={() => setIsPortfolioModalOpen(true)}
                  className="aspect-square bg-bg-alt rounded-[1.25rem] flex items-center justify-center flex-col gap-4 border-2 border-dashed border-primary cursor-pointer hover:bg-bg transition-colors"
                >
                  <span className="text-4xl">➕</span>
                  <span className="text-sm font-bold text-primary">Add Project</span>
                </div>
                
                {portfolioItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-[1.25rem] overflow-hidden border border-border shadow-[0_10px_30px_-10px_rgba(75,99,68,0.12)]">
                    <div 
                      className="h-36 bg-bg-alt bg-cover bg-center flex items-center justify-center text-5xl"
                      style={{ backgroundImage: item.image ? `url(${pb.files.getUrl(item as any, item.image)})` : 'none' }}
                    >
                      {!item.image && '🎨'}
                    </div>
                    <div className="p-6">
                      <h5 className="m-0 font-display text-base">{item.title}</h5>
                      <p className="text-xs mt-2 text-text-muted">{item.subject || 'General'} • {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}

                {portfolioItems.length === 0 && (
                  <div className="bg-white rounded-[1.25rem] overflow-hidden border border-border shadow-[0_10px_30px_-10px_rgba(75,99,68,0.12)]">
                    <div className="h-36 bg-accent-soft flex items-center justify-center text-5xl">🌋</div>
                    <div className="p-6">
                      <h5 className="m-0 font-display text-base">Example: Volcano Model</h5>
                      <p className="text-xs mt-2 text-text-muted">Science • Feb 6</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Kid Modal */}
      <Modal
        isOpen={isKidModalOpen}
        onClose={() => setIsKidModalOpen(false)}
        title={editingKid ? 'Edit Child' : 'Add a Child'}
        subtitle="Enter details to personalize their learning experience."
      >
        <form onSubmit={handleSaveKid}>
          <Input
            placeholder="Full Name (e.g. Emma Lynch)"
            value={kidName}
            onChange={(e) => setKidName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="number"
              placeholder="Age"
              value={kidAge}
              onChange={(e) => setKidAge(e.target.value)}
              required
            />
            <Select value={kidGrade} onChange={(e) => setKidGrade(e.target.value)}>
              <option>Preschool</option>
              <option>Kindergarten</option>
              <option>1st Grade</option>
              <option>2nd Grade</option>
              <option>3rd Grade</option>
              <option>4th Grade</option>
              <option>5th Grade</option>
              <option>6th Grade</option>
              <option>7th Grade</option>
              <option>8th Grade</option>
              <option>High School</option>
            </Select>
          </div>
          <Input
            placeholder="Current Focus (e.g. Astronomy, Early Reading)"
            value={kidFocus}
            onChange={(e) => setKidFocus(e.target.value)}
          />
          <div className="flex justify-end gap-6 mt-12">
            <Button type="button" variant="outline" onClick={() => setIsKidModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Profile</Button>
          </div>
        </form>
      </Modal>

      {/* Course Modal */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title="Track a New Course"
        subtitle="Set up a course to track daily lesson progress."
      >
        <form onSubmit={handleSaveCourse}>
          <Input
            placeholder="Course Name (e.g. Math, Ancient History)"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-6">
            <Input
              type="number"
              label="Total Lessons"
              value={totalLessons}
              onChange={(e) => setTotalLessons(e.target.value)}
              required
            />
            <Input
              type="number"
              label="Current Lesson"
              value={currentLesson}
              onChange={(e) => setCurrentLesson(e.target.value)}
              required
            />
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold text-primary mb-3">Active Days</p>
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    activeDays.includes(day)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-alt text-text-muted border-border hover:border-primary-light'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-6 mt-12">
            <Button type="button" variant="outline" onClick={() => setIsCourseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </div>
        </form>
      </Modal>

      {/* Portfolio Modal */}
      <Modal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        title="Add to Portfolio"
        subtitle="Upload a photo or sample of work."
      >
        <form onSubmit={handleSavePortfolio}>
          <Input
            placeholder="Project Title (e.g. Volcano Model)"
            value={portfolioTitle}
            onChange={(e) => setPortfolioTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Subject (e.g. Science, Art)"
            value={portfolioSubject}
            onChange={(e) => setPortfolioSubject(e.target.value)}
          />
          <div className="mt-4">
            <label className="block text-sm font-bold text-primary mb-2">Photo / Work Sample</label>
            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={(e) => setPortfolioFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-text-muted
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-bold
                file:bg-primary file:text-white
                hover:file:bg-primary-dark cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-6 mt-12">
            <Button type="button" variant="outline" onClick={() => setIsPortfolioModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Project</Button>
          </div>
        </form>
      </Modal>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
