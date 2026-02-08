# Kitt's Minecraft Classroom Demo
# Paste this into the Code Builder (press 'C') in Minecraft Education Edition.

def on_start():
    # 1. Clear space and build a platform
    # positions are relative to the player (~ is relative in commands, pos(x,y,z) in python)
    player.say("Initializing Kitt's Classroom...")
    
    # Floor: 10x10 gold platform 1 block below feet
    blocks.fill(GOLD_BLOCK, pos(-5, -1, -5), pos(5, -1, 5), FillOperation.REPLACE)
    
    # 2. Spawn the Tutor NPC
    # In EDU edition, 'spawn_npc' is the direct way to get a lesson guide
    mobs.spawn(NPC, pos(0, 0, 3))
    
    # 3. Add some decoration / logic
    blocks.place(GLOWSTONE, pos(0, 5, 0))
    
    player.say("Classroom ready! Right-click the NPC to see how lessons work.")
    player.say("Note: To change NPC dialogue, you must be in World Builder mode (/wb).")

on_start()
