import sys

import pygame

from settings import Settings
from ship import Ship


class AlienInvasion:
    """Class to manage game assets and behaviour"""

    def __init__(self):
        """Initislize and create game resources"""
        pygame.init()

    #    self.screen = pygame.display.set_mode((1200, 800))
    #    pygame.display.set_caption("Alien Invasion")

        # Setting a clock for managing framerate
        self.clock = pygame.time.Clock()

        # Getting Settings from settings.py
        self.settings = Settings()

        self.screen = pygame.display.set_mode(
            (self.settings.screen_width, self.settings.screen_height) )

        self.ship = Ship(self)

        # Set background colour
    #    self.bg_color = (230, 230, 230)

    def run_game(self):
        """Start the main loop for the game"""
        while True:
            # Watch for keyboard and mouse events.
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    sys.exit()
                
            # Redraw screen during each pass through the loop
        #    self.screen.fill(self.bg_color)
            self.screen.fill(self.settings.bg_color)

            self.ship.blitme()

            # Make the most recently drawn screen visible.
            pygame.display.flip()
            self.clock.tick(60)



if __name__ == "__main__":
    # Make a game invasion, and run the game.
    ai = AlienInvasion()

    # Creating an instance of the game
    ai.run_game()


