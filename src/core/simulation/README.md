# Making the make believe feel alive

A pile of code that is allowed to import and combine the more specifically organized objects together to do the magic that makes the game fun.

Code in the `simulation` module is allowed to make assumptions about the state of the game, and in general assumes that any dependency like game objects, game rules, any other game resources, have been loaded prior to calling the code within. If the assume prerequisites have not been met, expect the exceptional to happen.
