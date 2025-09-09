local angleX = 0
local angleY = 0
local angleZ = 0
local colorIndex = 0
local colorSpeed = 0.002
local cubePoints = {
    {-1, -1, -1},
    {1, -1, -1},
    {1, 1, -1},
    {-1, 1, -1},
    {-1, -1, 1},
    {1, -1, 1},
    {1, 1, 1},
    {-1, 1, 1}
}
local cubeEdges = {
    {1, 2}, {2, 3}, {3, 4}, {4, 1},
    {5, 6}, {6, 7}, {7, 8}, {8, 5},
    {1, 5}, {2, 6}, {3, 7}, {4, 8}
}
local colors = {
    {255, 0, 0},
    {255, 127, 0},
    {255, 255, 0},
    {0, 255, 0},
    {0, 0, 255},
    {75, 0, 130},
    {148, 0, 211},
    {255, 20, 147}
}
function rotatePoint(point, angleX, angleY, angleZ)
    local x, y, z = point[1], point[2], point[3]
    local cosX = math.cos(angleX)
    local sinX = math.sin(angleX)
    local newY = y * cosX - z * sinX
    local newZ = y * sinX + z * cosX
    y = newY
    z = newZ
    local cosY = math.cos(angleY)
    local sinY = math.sin(angleY)
    local newX = x * cosY + z * sinY
    local newZ2 = -x * sinY + z * cosY
    x = newX
    z = newZ2
    local cosZ = math.cos(angleZ)
    local sinZ = math.sin(angleZ)
    local newX2 = x * cosZ - y * sinZ
    local newY2 = x * sinZ + y * cosZ
    x = newX2
    y = newY2
    return {x, y, z}
end
function projectPoint(point, width, height)
    local x, y, z = point[1], point[2], point[3]
    local distance = 8
    if z + distance <= 0 then
        return {width / 2, height / 2}
    end
    local factor = distance / (distance + z)
    x = x * factor * 150 + width / 2
    y = y * factor * 150 + height / 2
    return {math.floor(x), math.floor(y)}
end
function getInterpolatedColor(color1, color2, factor)
    local r = math.floor(color1[1] * (1 - factor) + color2[1] * factor)
    local g = math.floor(color1[2] * (1 - factor) + color2[2] * factor)
    local b = math.floor(color1[3] * (1 - factor) + color2[3] * factor)
    return {r, g, b}
end
function drawCube()
    local rotatedPoints = {}
    for i, point in ipairs(cubePoints) do
        local rotated = rotatePoint(point, angleX, angleY, angleZ)
        local projected = projectPoint(rotated, love.graphics.getWidth(), love.graphics.getHeight())
        rotatedPoints[i] = projected
    end
    for _, edge in ipairs(cubeEdges) do
        local start = rotatedPoints[edge[1]]
        local endPoint = rotatedPoints[edge[2]]
        local color1 = colors[math.floor(colorIndex) % #colors + 1]
        local color2 = colors[(math.floor(colorIndex) + 1) % #colors + 1]
        local factor = colorIndex - math.floor(colorIndex)
        local color = getInterpolatedColor(color1, color2, factor)
        love.graphics.setColor(color[1] / 255, color[2] / 255, color[3] / 255)
        love.graphics.setLineWidth(3)
        love.graphics.line(start[1], start[2], endPoint[1], endPoint[2])
    end
end
function love.load()
    love.window.setTitle("cube.all")
    love.window.setMode(800, 600, {resizable = false, borderless = true})
end
function love.update(dt)
    if love.keyboard.isDown("left") then
        angleY = angleY - 0.01
    end
    if love.keyboard.isDown("right") then
        angleY = angleY + 0.01
    end
    if love.keyboard.isDown("up") then
        angleX = angleX - 0.01
    end
    if love.keyboard.isDown("down") then
        angleX = angleX + 0.01
    end
    angleX = angleX + 0.003
    angleY = angleY + 0.002
    angleZ = angleZ + 0.0015
    colorIndex = colorIndex + colorSpeed
    if colorIndex >= #colors then
        colorIndex = 0
    end
end
function love.draw()
    love.graphics.setColor(0, 0, 0)
    love.graphics.rectangle("fill", 0, 0, love.graphics.getWidth(), love.graphics.getHeight())
    drawCube()
    love.graphics.setColor(1, 1, 1)
    love.graphics.setFont(love.graphics.newFont(36))
    local infoText = string.format("X = %.1f | Y = %.1f | Z = %.1f", angleX, angleY, angleZ)
    love.graphics.print(infoText, 10, 10)
end
function love.keypressed(key)
    if key == "escape" or key == "q" then
        love.event.quit()
    end
end
