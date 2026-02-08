# Marketing Section Patterns

Quick-reference for Tailwind Plus marketing component patterns.

## Hero Sections

### Simple Centered

```html
<section class="relative isolate px-6 py-24 sm:py-32 lg:px-8">
  <div class="mx-auto max-w-2xl text-center">
    <h1 class="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
      Deploy to the cloud with confidence
    </h1>
    <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
      Anim aute id magna aliqua ad ad non deserunt sunt.
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
      <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
        Get started
      </a>
      <a href="#" class="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
        Learn more <span aria-hidden="true">→</span>
      </a>
    </div>
  </div>
</section>
```

### Split with Screenshot

```html
<section class="overflow-hidden py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <div class="lg:pr-8 lg:pt-4">
        <div class="lg:max-w-lg">
          <p class="text-base font-semibold leading-7 text-indigo-600">Deploy faster</p>
          <h1 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            A better workflow
          </h1>
          <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Lorem ipsum dolor sit amet consect adipisicing elit.
          </p>
          <div class="mt-10 flex items-center gap-x-6">
            <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
              Get started
            </a>
          </div>
        </div>
      </div>
      <img src="screenshot.png" alt="App screenshot" class="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-zinc-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0" />
    </div>
  </div>
</section>
```

### With Background Gradient

```html
<section class="relative isolate overflow-hidden bg-white dark:bg-zinc-900">
  <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
    <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
  </div>
  <!-- Hero content here -->
</section>
```

## Feature Sections

### With Icon Grid

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <p class="text-base font-semibold leading-7 text-indigo-600">Deploy faster</p>
      <h2 class="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Everything you need to deploy your app
      </h2>
      <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
      </p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-zinc-900 dark:text-white">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            Push to deploy
          </dt>
          <dd class="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Lorem ipsum dolor sit amet consect adipisicing elit.
          </dd>
        </div>
        <!-- More features -->
      </dl>
    </div>
  </div>
</section>
```

### Bento Grid

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl sm:text-center">
      <h2 class="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Everything in one place
      </h2>
      <p class="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Excepteur sint occaecat cupidatat non proident.
      </p>
    </div>
    <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <!-- Large card spanning 2 columns -->
      <div class="lg:col-span-2 lg:row-span-2 flex flex-col rounded-3xl bg-zinc-900 p-8 lg:p-12">
        <h3 class="text-xl font-semibold text-white">Performance</h3>
        <p class="mt-3 text-base text-zinc-400">
          Excepteur sint occaecat cupidatat non proident.
        </p>
        <div class="mt-auto pt-8">
          <img src="stats.svg" alt="" class="w-full" />
        </div>
      </div>
      
      <!-- Small card -->
      <div class="flex flex-col rounded-3xl bg-zinc-100 p-8 dark:bg-zinc-800">
        <h3 class="text-xl font-semibold text-zinc-900 dark:text-white">Security</h3>
        <p class="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          Excepteur sint occaecat cupidatat.
        </p>
      </div>
      
      <!-- Another small card -->
      <div class="flex flex-col rounded-3xl bg-zinc-100 p-8 dark:bg-zinc-800">
        <h3 class="text-xl font-semibold text-zinc-900 dark:text-white">Integrations</h3>
        <p class="mt-3 text-base text-zinc-600 dark:text-zinc-400">
          Excepteur sint occaecat cupidatat.
        </p>
      </div>
    </div>
  </div>
</section>
```

## Pricing Sections

### Three Tiers

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-4xl text-center">
      <p class="text-base font-semibold leading-7 text-indigo-600">Pricing</p>
      <h2 class="mt-2 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
        Choose the right plan for you
      </h2>
    </div>
    <div class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      <!-- Standard tier -->
      <div class="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-zinc-200 xl:p-10 dark:bg-zinc-800 dark:ring-zinc-700">
        <div>
          <h3 class="text-lg font-semibold leading-8 text-zinc-900 dark:text-white">Starter</h3>
          <p class="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Perfect for getting started.
          </p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">$15</span>
            <span class="text-sm font-semibold leading-6 text-zinc-600 dark:text-zinc-400">/month</span>
          </p>
          <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <li class="flex gap-x-3">
              <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
              </svg>
              5 products
            </li>
            <!-- More features -->
          </ul>
        </div>
        <a href="#" class="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Get started
        </a>
      </div>
      
      <!-- Featured tier -->
      <div class="flex flex-col justify-between rounded-3xl bg-zinc-900 p-8 ring-1 ring-zinc-900 xl:p-10 lg:z-10 lg:rounded-b-none">
        <div>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold leading-8 text-white">Pro</h3>
            <span class="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white">Most popular</span>
          </div>
          <p class="mt-4 text-sm leading-6 text-zinc-300">
            For growing businesses.
          </p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-white">$30</span>
            <span class="text-sm font-semibold leading-6 text-zinc-300">/month</span>
          </p>
          <!-- Features list -->
        </div>
        <a href="#" class="mt-8 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100">
          Get started
        </a>
      </div>
      
      <!-- Enterprise tier -->
      <!-- Similar structure to Standard -->
    </div>
  </div>
</section>
```

## Testimonials

### Simple Centered

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-xl text-center">
      <figure>
        <blockquote class="text-xl font-semibold leading-8 text-zinc-900 sm:text-2xl sm:leading-9 dark:text-white">
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias molestiae."
        </blockquote>
        <figcaption class="mt-10">
          <img class="mx-auto h-10 w-10 rounded-full" src="avatar.jpg" alt="" />
          <div class="mt-4 flex items-center justify-center space-x-3 text-base">
            <div class="font-semibold text-zinc-900 dark:text-white">Judith Black</div>
            <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" class="fill-zinc-900 dark:fill-white">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <div class="text-zinc-600 dark:text-zinc-400">CEO of Workcation</div>
          </div>
        </figcaption>
      </figure>
    </div>
  </div>
</section>
```

## CTA Sections

### Simple Centered

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <h2 class="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Boost your productivity.
        <br />
        Start using our app today.
      </h2>
      <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum.
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
          Get started
        </a>
        <a href="#" class="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
</section>
```

### With Split Background

```html
<section class="relative isolate bg-zinc-900">
  <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
    <div class="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
      <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Start building for free
      </h2>
      <p class="mt-6 text-lg leading-8 text-zinc-300">
        Ac euismod vel sit maecenas id pellentesque eu sed consectetur.
      </p>
      <div class="mt-10 flex items-center gap-x-6">
        <a href="#" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100">
          Get started
        </a>
        <a href="#" class="text-sm font-semibold leading-6 text-white">
          Learn more <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
    <div class="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow">
      <img src="app-screenshot.png" alt="" class="w-[22.875rem] max-w-full rounded-xl shadow-xl ring-1 ring-white/10" />
    </div>
  </div>
</section>
```

## Footer

### Simple with Columns

```html
<footer class="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
  <div class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
    <div class="xl:grid xl:grid-cols-3 xl:gap-8">
      <img class="h-7" src="logo.svg" alt="Company name" />
      <div class="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
        <div class="md:grid md:grid-cols-2 md:gap-8">
          <div>
            <h3 class="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Solutions</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li>
                <a href="#" class="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Marketing</a>
              </li>
              <!-- More links -->
            </ul>
          </div>
          <div class="mt-10 md:mt-0">
            <h3 class="text-sm font-semibold leading-6 text-zinc-900 dark:text-white">Support</h3>
            <ul role="list" class="mt-6 space-y-4">
              <li>
                <a href="#" class="text-sm leading-6 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">Documentation</a>
              </li>
              <!-- More links -->
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
      <p class="text-xs leading-5 text-zinc-500">&copy; 2024 Your Company, Inc. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## Stats Section

```html
<section class="py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-zinc-600 dark:text-zinc-400">Transactions every 24 hours</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">44 million</dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-zinc-600 dark:text-zinc-400">Assets under holding</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">$119 trillion</dd>
      </div>
      <div class="mx-auto flex max-w-xs flex-col gap-y-4">
        <dt class="text-base leading-7 text-zinc-600 dark:text-zinc-400">New users annually</dt>
        <dd class="order-first text-3xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-white">46,000</dd>
      </div>
    </dl>
  </div>
</section>
```
