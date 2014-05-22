Mission MARS
============

[demo](http://vrap.github.io/mission-mars/)

Mission Mars is a little experiment simulation project of a rover exploring a generated mars terrain.

The generation of the field was created with extension in mind, this let us customize the terrain by adding some sort of altitude (called elements) like crater or hill easily. Maps have some properties like altitude, materials, etc and the rover can fulfill two types of missions : explore and voyage.

Missions of the rover can be extended and new one can be created like for the other things of this project.


Technically speaking, this project use [THREE.js](https://github.com/mrdoob/three.js) for 3d visualization and [Q.js](https://github.com/kriskowal/q) for deferring all of the rover actions.

Some improvements can be made like :
* Using workers for the terrain generation
* Improving missions algorithm (voyager and explorer)
* Manage multiple materials in the 3D view
* Code improvements !
* and a lot more stuff

In order to create maps, a derived form of the diamond square algorithm was implemented to make the first ground, after the base was generated we are adding some elements (hills for examples) depending of the configuration of TerrainGenerator configuration and in the end the terrain his smoothed to make it more coherent.

For the rover, his intelligence is called "S3000", this is the class that control the rover and that contain some "modules" that define the behavior of the rover in order to fulfill the requested mission.

Hope you will enjoy this project, feel free to comment or contribute to it.
