# Kitt's Minecraft Classroom Demo (FIXED)
# Paste this into the Code Builder (press 'C') in Minecraft Education Edition.

def on_start():
    player.say("Initializing Kitt's Classroom...")
    
    # 1. Build a 10x10 gold platform 1 block below you
    # Using block ID strings for maximum compatibility
    blocks.fill("gold_block", pos(-5, -1, -5), pos(5, -1, 5), FillOperation.REPLACE)
    
    # 2. Spawn the Tutor NPC using a direct command
    # This bypasses the 'NPC is not defined' error in the Python shim
    player.run_command("summon npc ~ ~ ~3")
    
    # 3. Add a glowstone light above
    blocks.place("glowstone", pos(0, 5, 0))
    
    player.say("Classroom ready! Right-click the NPC to see how lessons work.")
    player.say("Note: Type /wb to enter 'World Builder' mode so you can edit the NPC.")

on_start()
