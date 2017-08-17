# Pontifex
Simple screeps code base.

## Features
* multi-stage room development
* colonial development
	* chartered exploration
* harvesting and upgrading
	* independant / single-creep
	* container-based with `CARRY` support creeps
	* priority and distance-based target selection
	* link usage if present
* build & repair 
	* versatile creeps
	* tower-based repair/heal
* monitor creep levels and replace
* diagnostic economic analysis
* defense
	* tower-centric
	* targets healers first
	* defenders spawned manually
	
## Todo
* remote harvesting
* guided expansion / remote room development
  * automatic selection of remote harvest targets
* new-fangled target assignment
	* task-based
	* capable of spawning new creeps if needed
	* can re-assign creeps between roles
	* multi-room with independant rooms but can assign tasks across rooms
* Generalize energy gathering and consumption code base (nerf herder^scruffy-looking^)
* Architect module for structure placement
* Economic analysis that affects decisions
* Lab / Terminal / Market use
    1. determine which chemicals we have access to
    1. determine best value-proposition for lab use
    1. move materials to that room
        a. couriered delivery
        a. terminal transmission
    1. assign labs chemical type and goal
    1. sherpa creeps automatically move chemicals as required
    1. labs process chemicals when available
* power seeking 
    1. use observer to scan likely rooms
    1. observe threat / payoff
    1. create charter to that roof
    1. monitor charters & abandon if needed
* power using
    
    