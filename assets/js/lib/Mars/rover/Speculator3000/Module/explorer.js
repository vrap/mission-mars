(function() {
    var nsExplorer = using('mars.rover.speculator3000.module.explorer');
    var nsSpeculator = using('mars.rover.speculator3000');
    var nsRover = using('mars.rover');
    var nsCommon = using('mars.common');

    /**
     * Class constructor of explorer module.
     * The explorer module must explore the largest poosible area with the least possible movement.
     */
    nsExplorer.Explorer = function(s3000) {
        this.speculator = s3000;
    };

    /**
     * Name of the module.
     * @type {String}
     */
    nsExplorer.Explorer.prototype.name = 'explorer';

    /**
     * Example of onEnabled event triggered when explorer mode is enabled by S3000 on the rover.
     */
    nsExplorer.Explorer.prototype.onEnabled = function() {
        console.log('Explorer mode enabled');
    };

    /**
     * Example of onDisabled event triggered when explorer mode is disabled by S3000 on the rover.
     */
    nsExplorer.Explorer.prototype.onDisabled = function() {
        console.log('Explorer mode disabled');
    };

    /**
     * Start the explorer scenario.
     */
    nsExplorer.Explorer.prototype.start = function() {
        // console.log('Spéculation nombre de mouvements : ' + this.speculatedMovements());

        var isWestSide = this.determineStartSide();
        var startX = this.speculator.rover.x;
        var startY = this.speculator.rover.y;
        
        this.explore(isWestSide);
    };

    nsExplorer.Explorer.prototype.explore = function(isWestSide) {
        if (isWestSide) { console.log('Va au bord Ouest');
            this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.WEST);

            while (this.speculator.rover.x > 2) {
                this.speculator.rover.move(1);
                this.speculator.rover.fullScan();
            }
        }
        else { console.log('Va au bord Est');
            this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.EAST);

            while (this.speculator.rover.x < parseInt(this.speculator.rover.map.getWidth() - 2)) {
                this.speculator.rover.move(1);
                this.speculator.rover.fullScan();
            }
        }

        this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.NORTH);

        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
        this.speculator.rover.move(1);

        while (this.speculator.rover.y > 2) { // console.log('Y du rover : ' + this.speculator.rover.y);
            this.exploreHalfMapWidth();
        }

        // console.log(this.speculator.rover.memory.readAll());

   
        //this.moveSouthWestCoin();
        
        //this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.EAST);

        //while (this.speculator.rover.y < this.speculator.rover.map.getHeight() - 2) {
            //this.exploreMapWidth();
        //}

            /*var distance = ((position - destination) > 1) ? 2 : 1;

            if (this.speculator.rover[directions[currentDirection]] == destination[directions[currentDirection]]) {
            currentDirection = invertedDirection;
            invertedDirection = this.speculator.rover.direction; 
            }

            this.speculator.rover.setDirection(currentDirection);

            try {
            this.speculator.rover.move(distance);
            }
            catch (error) {
            invertedDirection = currentDirection;
            currentDirection = this.speculator.rover.direction;
            }
        }*/
    };

    /*nsExplorer.Explorer.prototype.moveSouthWestCoin = function() {
        this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.SOUTH);

        // TODO: move 2 squares rather than 1
        // TODO : keep 2 squares between rover and borders

        // As the rover has not arrived at the southern edge of the map
        while (this.speculator.rover.y > 0) {
           this.speculator.rover.move(1);
        }
            
        // If the rover is on the southern edge of the map
        if (this.speculator.rover.y == 0) { console.log('ok1');
            this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.WEST);

            // As the rover has not arrived at the western edge of the map
            while (this.speculator.rover.x > 0) {       
                this.speculator.rover.move(1);

                // If the rover is on the western edge of the map
                if (this.speculator.rover.x == 0) { console.log('ok2');
                    console.log('STARTING POSITION : OK');
                }
            }
        }
    };*/

    nsExplorer.Explorer.prototype.exploreHalfMapWidth = function() {
        if (this.speculator.rover.x == parseInt(this.speculator.rover.map.getWidth() - 2)) { console.log('Va au bord Ouest');
            this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.WEST);

            while (this.speculator.rover.x > 2) {
                this.speculator.rover.move(1);
                this.speculator.rover.fullScan();
            }
        }
        else if (this.speculator.rover.x == 2) { console.log('Va au bord Est');
            this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.EAST);

            while (this.speculator.rover.x < this.speculator.rover.map.getWidth() - 2) {
                this.speculator.rover.move(1);
                this.speculator.rover.fullScan();
            }
        }

        // TODO : tant que y n'est pas en haut => nord. Sinon => sud

        this.speculator.rover.setDirection(nsRover.Rover.DIRECTION.NORTH);

        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
        this.speculator.rover.move(1);
    };

    nsExplorer.Explorer.prototype.determineStartSide = function() {
        isWestSide = false;

        if (this.speculator.rover.x < Math.round(this.speculator.rover.map.getWidth() / 2)) {
            isWestSide = true;
        }
        
        return isWestSide;
    };
    
    nsExplorer.Explorer.prototype.centerWestBorder = function() {

    };

    nsExplorer.Explorer.prototype.centerEastBorder = function() {

    };

    nsExplorer.Explorer.prototype.speculatedMovements = function() {
        return Math.round(this.speculator.rover.map.getWidth() * (this.speculator.rover.map.getHeight() / 5) - (4 * this.speculator.rover.map.getHeight()) - (4 * this.speculator.rover.map.getWidth()));
    };

    /* Add the explorer module to Speculator3000. */
    nsSpeculator.S3000.addModule(nsExplorer.Explorer);
})();