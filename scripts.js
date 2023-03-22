window.onload=()=>{
    initializeGrid(40);
}

// initialize mouse variables
var mouse_down = false;

// initialize start location
var start_row_num = null;
var start_col_num = null;

// initialize end location
var end_row_num = null;
var end_col_num = null;

// if true, the start or end can be changed
var set_start = false;
var set_end = false;
var add_walls = false;


// populate the grid-container with grid-squares
// the number of rows = 0.6*<number of columns>
function initializeGrid(size){
    // set number of rows and columns in the grid
    var rows = 0.6 * size;
    var cols = size;

    // find the grid-container element
    const grid_container = document.getElementById("grid-container");

    // fill grid-container with grid-square elements
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
            // initialize attributes grid-squares
            const col_num = document.createAttribute("data-column-num");
            const row_num = document.createAttribute("data-row-num");
            const is_end = document.createAttribute("data-is-end");
            const is_start = document.createAttribute("data-is-start");
            const is_wall = document.createAttribute("data-is-wall");

            // update the coordinate attributes and intialize booleans
            col_num.nodeValue = j;
            row_num.nodeValue = i;
            is_end.nodeValue = false;
            is_start.nodeValue = false;
            is_wall.nodeValue = false;

            // grid_square attributes
            const grid_square = document.createElement("div");
            grid_square.className = 'grid-square';
            grid_square.setAttributeNode(row_num);
            grid_square.setAttributeNode(col_num);
            grid_square.setAttributeNode(is_end);
            grid_square.setAttributeNode(is_start);
            grid_square.setAttributeNode(is_wall);

            // grid_squre event listeners:
            grid_square.addEventListener('click', function(event){
                if (set_end == true){
                    // change end sqaure to this current square
                    setEndLocation(parseInt(col_num.nodeValue), parseInt(row_num.nodeValue));
                }
                if (set_start == true){
                    // change start square to this current square
                    setStartLocation(parseInt(col_num.nodeValue), parseInt(row_num.nodeValue));
                }
            });

            // user can draw walls by dragging mouse around the grid
            grid_square.addEventListener('mousedown', function(event){
                mouse_down = true;
                if (add_walls == true){
                    // toggle this square as a wall
                    toggleWall(parseInt(col_num.nodeValue), parseInt(row_num.nodeValue));
                }
            });
            grid_square.addEventListener('mouseenter', function(event){
                if (add_walls == true){
                    if(mouse_down == true){
                        // toggle the square as a wall
                        toggleWall(parseInt(col_num.nodeValue), parseInt(row_num.nodeValue));
                    }
                }
            });
            grid_square.addEventListener('mouseup', function(event){
                mouse_down = false;
            });

            // add the grid-square element to the grid-container element after it is done being set up
            grid_container.appendChild(grid_square);
        }
    }

    // add the grid-square elements to the grid-container
    grid_container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    grid_container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
}


function endButtonClicked(){
    // toggle set_end when the button is clicked
    if (set_end == true){
        set_end = false;
    }
    else if (set_end == false){
        // if set_start is true and set_end is true, automatically set set_start to false so the start and end are not on the same block
        if (set_start == true){
            set_start = false;
        }
        if (add_walls == true){
            add_walls = false;
        }
        set_end = true;
    }
    
}


function startButtonClicked(){
    // toggle set_start when the button is clicked
    if (set_start == true){
        set_start = false;
    }
    else if (set_start == false){
        // if set_start is being set to true, but set_end is also true, automatically set set_end to false so the start and end aren't on the same square
        set_start = true;
        if(set_end == true){
            set_end = false;
        }
        if (add_walls == true){
            add_walls = false;
        }
    }
}


function setEndLocation(x_coord, y_coord){

    // if an end location has not been set yet, this can be skipped
    if (end_row_num != null){
        // go to the current end square and set its "is_end" attribute to false so there are not 2 start locations.
        var old_end_square_index = (40 * end_row_num) + end_col_num;
        const old_end_square = document.getElementsByClassName('grid-square')[old_end_square_index];
        old_end_square.attributes[3].nodeValue = false;
        old_end_square.style.backgroundColor = 'rgb(225, 225, 225)';
    }

    // update the is_end attribute on the new end square to "true"
    var new_end_square_index = (40 * y_coord) + x_coord;
    const new_end_square = document.getElementsByClassName('grid-square')[new_end_square_index];
    new_end_square.attributes[3].nodeValue = true;
    new_end_square.style.backgroundColor = 'skyblue';

    // update the global end location variables to the function arguments
    end_row_num = y_coord;
    end_col_num = x_coord;
}


function setStartLocation(x_coord, y_coord){
    // if an end location has not been set yet, this can be skipped
    if (start_row_num != null){
        // go to the current end square and set its "is_end" attribute to false so there are not 2 start locations.
        var old_start_square_index = (40 * start_row_num) + start_col_num;
        const old_start_square = document.getElementsByClassName('grid-square')[old_start_square_index];
        old_start_square.attributes[3].nodeValue = false;
        old_start_square.style.backgroundColor = 'rgb(225, 225, 225)';
    }

    // update the is_start attribute on the new start square to "true"
    var new_start_square_index = (40 * y_coord) + x_coord;
    const new_start_square = document.getElementsByClassName('grid-square')[new_start_square_index];
    new_start_square.attributes[3].nodeValue = true;
    new_start_square.style.backgroundColor = 'lightcoral';

    // update the global start location variables to the function arguments
    start_row_num = y_coord;
    start_col_num = x_coord;
}


function addWallsButtonClicked(){

    // toggles the add_walls variable
    // if either set_start or set_end are true when add_walls is being set to true, they will be set to false to
    // prevent one square from being set to multiple square types
    if (add_walls == false){
        add_walls = true;
        if (set_start == true){
            set_start = false;
        }
        if (set_end == true){
            set_end = false;
        }
    }
    else{
        add_walls = false;
    }
}


function toggleWall(x_coord, y_coord){

    // get the square at the location passed in
    var square_index = (40 * y_coord) + x_coord;
    const square = document.getElementsByClassName('grid-square')[square_index];


    // turns the square into a wall
    if(square.attributes[5].nodeValue == false){
        square.attributes[5].nodeValue = true;
        square.style.backgroundColor = 'darkslategray';
    }
    // converts a square back from a wall
    else{
        square.attributes[5].nodeValue = false;
        square.style.backgroundColor = 'gray';
    }
}