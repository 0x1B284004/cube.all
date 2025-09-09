function love.conf(t)
    t.title = "cube.all"
    t.author = "0x1b"
    t.version = "11.5"
    
    t.window.width = 800
    t.window.height = 600
    t.window.resizable = false
    t.window.borderless = true
    t.window.fullscreen = false
    t.window.vsync = 1
    
    t.console = false
    t.modules.joystick = false
    t.modules.physics = false
    t.modules.thread = false
    t.modules.touch = false
end
