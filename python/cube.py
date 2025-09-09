import os
import sys
import warnings
warnings.filterwarnings('ignore')
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
import pygame
import math
from pygame.locals import *
pygame.init()
WIDTH = 800
HEIGHT = 600
screen = pygame.display.set_mode((WIDTH, HEIGHT), pygame.NOFRAME)
clock = pygame.time.Clock()
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
cube_points = [
    [-1, -1, -1],
    [1, -1, -1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1]
]
cube_edges = [
    (0, 1), (1, 2), (2, 3), (3, 0),
    (4, 5), (5, 6), (6, 7), (7, 4),
    (0, 4), (1, 5), (2, 6), (3, 7)
]
angle_x = 0
angle_y = 0
angle_z = 0
color_index = 0
color_speed = 0.02
colors = [
    (255, 0, 0),
    (255, 127, 0),
    (255, 255, 0),
    (0, 255, 0),
    (0, 0, 255),
    (75, 0, 130),
    (148, 0, 211),
    (255, 20, 147)
]
def rotate_point(point, angle_x, angle_y, angle_z):
    x, y, z = point
    cos_x, sin_x = math.cos(angle_x), math.sin(angle_x)
    y, z = y * cos_x - z * sin_x, y * sin_x + z * cos_x
    cos_y, sin_y = math.cos(angle_y), math.sin(angle_y)
    x, z = x * cos_y + z * sin_y, -x * sin_y + z * cos_y
    cos_z, sin_z = math.cos(angle_z), math.sin(angle_z)
    x, y = x * cos_z - y * sin_z, x * sin_z + y * cos_z
    return [x, y, z]
def project_point(point, width, height):
    x, y, z = point
    distance = 8
    factor = distance / (distance + z)
    x = x * factor * 150 + width // 2
    y = y * factor * 150 + height // 2
    return int(x), int(y)
def get_interpolated_color(color1, color2, factor):
    r = int(color1[0] * (1 - factor) + color2[0] * factor)
    g = int(color1[1] * (1 - factor) + color2[1] * factor)
    b = int(color1[2] * (1 - factor) + color2[2] * factor)
    return (r, g, b)
def draw_cube():
    rotated_points = []
    for point in cube_points:
        rotated = rotate_point(point, angle_x, angle_y, angle_z)
        projected = project_point(rotated, WIDTH, HEIGHT)
        rotated_points.append(projected)
    for edge in cube_edges:
        start = rotated_points[edge[0]]
        end = rotated_points[edge[1]]
        color1 = colors[int(color_index) % len(colors)]
        color2 = colors[(int(color_index) + 1) % len(colors)]
        factor = color_index - int(color_index)
        color = get_interpolated_color(color1, color2, factor)
        pygame.draw.line(screen, color, start, end, 3)
def main():
    global angle_x, angle_y, angle_z, color_index
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == QUIT:
                running = False
            elif event.type == KEYDOWN:
                if event.key == K_ESCAPE or event.key == K_q:
                    running = False
        keys = pygame.key.get_pressed()
        if keys[K_LEFT]:
            angle_y -= 0.05
        if keys[K_RIGHT]:
            angle_y += 0.05
        if keys[K_UP]:
            angle_x -= 0.05
        if keys[K_DOWN]:
            angle_x += 0.05
        angle_x += 0.02
        angle_y += 0.015
        angle_z += 0.01
        color_index += color_speed
        if color_index >= len(colors):
            color_index = 0
        screen.fill(BLACK)
        draw_cube()
        font = pygame.font.Font(None, 36)
        info_text = f"X = {angle_x:.1f} | Y = {angle_y:.1f} | Z = {angle_z:.1f}"
        text_surface = font.render(info_text, True, WHITE)
        screen.blit(text_surface, (10, 10))
        font_small = pygame.font.Font(None, 24)
        instructions = [
        ]
        for i, instruction in enumerate(instructions):
            text = font_small.render(instruction, True, WHITE)
            screen.blit(text, (10, HEIGHT - 60 + i * 25))
        pygame.display.flip()
        clock.tick(60)
    pygame.quit()
    sys.exit()
if __name__ == "__main__":
    main()