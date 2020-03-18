// =============================================================================
// Random 16 x 16 Tile Generator by Michael McLarnon
// =============================================================================
// globals go here

// global to hold an array containing all the colour hex codes
var colour_hex_codes = -1;

// global to hold the 400 randomly generated tiles
var tiles = -1;

// global array to hold the indices of all selected tiles
// (these range from 0 to 399 inclusive)
var selected_tiles = -1;
// =============================================================================
// Called when the page first loads.
// =============================================================================
function initialise_page() {

	// clear out the global list of colour hex codes
	colour_hex_codes = [];

	// build a list of random colour hex codes and stick them in the global
	// variable colour_hex_codes
	var colour_names = Object.keys(colour_names_and_hex_codes);
	for (var i = 0; i < colour_names.length; ++i) {
		var colour_name = colour_names[i];
		var hex_code = colour_names_and_hex_codes[colour_name];
		colour_hex_codes.push(hex_code);
	}
	
	return;
}
// =============================================================================
// Called when the GENERATE RANDOM TILES button is pressed. Generates 400 random
// tiles and displays them in the random_tile_canvas.
// =============================================================================
function generate_random_tiles() {
	
	// clear out the global array tiles
	tiles = [];
	
	// generate 400 random tiles
	for (var i = 0; i < 400; ++i) {
		var tile = generate_random_tile();
		tiles.push(tile);
	}
	
	// draw all the tiles in the hidden_tile_canvas
	for (var i = 0; i < tiles.length; ++i) {
		var tile_object = tiles[i];
		var top_left_x = i * 16;
		var top_left_y = 0;
		draw_tile_in_hidden_tile_canvas(top_left_x, top_left_y, tile_object);
	}
	
	// get the random_tile_canvas
	var random_tile_canvas = gebi("random_tile_canvas");
	var ctx = random_tile_canvas.getContext("2d");

	// use the tiles drawn in the hidden tile canvas to draw all the tiles in
	// the random_tile_canvas
	for (var i = 0; i < 400; ++i) {
		// set all the drawing information
		var img = gebi("hidden_tile_canvas");
		var source_x = i * 16;
		var source_y = 0;
		var source_width = 16;
		var source_height = 16;
		var destination_row = Math.floor(i / 20);
		var destination_col = i % 20;
		var destination_x = destination_col * 16;
		var destination_y = destination_row * 16;
		var width = 16;
		var height = 16;
		// draw the tile
		ctx.drawImage(img, source_x, source_y, source_width, source_height,
								destination_x, destination_y, width, height);
	}

	return;
}
// =============================================================================
// Draw the tile represented by tile_object in the hidden_tile_canvas, with its
// top left pixel at position (top_left_x, top_left_y)
// =============================================================================
function draw_tile_in_hidden_tile_canvas(top_left_x, top_left_y, tile_object) {
	
	var canvas = gebi("hidden_tile_canvas");
	var ctx = canvas.getContext("2d");
	
	var colours = tile_object["colours"];
	var pixel_map = tile_object["pixels"];
	
	// draw all the pixels
	for (var row = 0; row < 16; ++row) {
		var row_of_pixels = pixel_map[row];
		for (var col = 0; col < 16; ++col) {
			// get pixel character, parse it to an int colour index
			var pixel_character = row_of_pixels.substring(col, col + 1);
			var colour_index = parseInt(pixel_character);
			var colour_hex_code = colours[colour_index];
			// set current pixel colour
			ctx.fillStyle = colour_hex_code;
			// draw current pixel
			ctx.fillRect(top_left_x + col, top_left_y + row, 1, 1);
		}
	}
	
	return;
}
// =============================================================================
// Generate a random tile and return it.
// =============================================================================
function generate_random_tile() {
	
	// build a random pixel map template
	var pixel_map = build_random_pixel_map();
	
	// count the total number of different colours in the pixel map
	var pixel_characters_found = [];
	var total_colours = 0;
	for (var row = 0; row < 16; ++row) {
		var row_of_pixels = pixel_map[row];
		for (var i = 0; i < row_of_pixels.length; ++i);
		var pixel_character = row_of_pixels.substring(i, i + 1);
		if (pixel_characters_found.indexOf(pixel_character) == -1) {
			++total_colours;
			pixel_characters_found.push(pixel_character);
		}
	}
	
	// use total_colours to build the colours array for the tile object
	var colours = [];
	while (colours.length <= total_colours) {
		// select a random colour
		var random_index = randint(0, colour_hex_codes.length - 1);
		var colour_hex_code = colour_hex_codes[random_index];
		// if the colour isn't already in the array colours, push it on there
		if (colours.indexOf(colour_hex_code) == -1) {
			colours.push(colour_hex_code);
		}
	}
	
	// build the tile object and return it
	var tile_object = 	{
		"description"	: "",
		"colours"		: colours,
		"pixels"		: pixel_map
						};

	return tile_object;
}
// =============================================================================
// Build a random 16 x 16 pixel map and return it.
// =============================================================================
function build_random_pixel_map() {
	
	var random_number = randint(0, 1);
	
	var pixel_map;
	
	if (random_number === 0) {
		pixel_map = build_single_inner_square_pixel_map();
	}
	
	if (random_number === 1) {
		pixel_map = build_random_inner_squares_pixel_map();
	}
	
	// more tile types here (including diamond centre tile, random squares
	// tiles, random inner rectangles tile etc.)
	// CODE HERE
	
	// decide whether to round the edges of the tiles and, if so, how much
	// (e.g. 1 pixel off the corners, 2 pixels, 3 pixels etc.)
	// CODE HERE
	
	return pixel_map;
}
// =============================================================================
// The single inner square pixel map is a pixel map with two different colours.
// The middle of the tile is a centered square with a random square side length
// from 2 to 14 and is a multiple of 2, to enable it to be centered in the
// 16 x 16 tile map.
// =============================================================================
function build_single_inner_square_pixel_map() {
	
	var inner_square_side_length = randint(1, 7) * 2;

	// ++++++++++++++++++
	// build the tile map
	// ++++++++++++++++++
	var pixel_map = [];
	// first few lines of pixels are the first colour
	var row_of_colour_one_pixels = "0000000000000000";
	var total_first_colour_rows = 16 - inner_square_side_length;
	for (var i = 0; i < total_first_colour_rows / 2; ++i) {
		pixel_map.push(row_of_colour_one_pixels);
	}
	// centre rows contain colour one and colour two
	// build a template for the centre rows of pixels
	var centre_row_of_pixels = "";
	for (var i = 0; i < total_first_colour_rows / 2; ++i) {
		centre_row_of_pixels += '0';
	}
	for (var i = 0; i < 16 - total_first_colour_rows; ++i) {
		centre_row_of_pixels += '1';
	}
	for (var i = 0; i < total_first_colour_rows / 2; ++i) {
		centre_row_of_pixels += '0';
	}
	// add the centre rows of pixels
	for (var i = 0; i < 16 - total_first_colour_rows; ++i) {
		pixel_map.push(centre_row_of_pixels);
	}
	// add the bottom rows of pixels
	for (var i = 0; i < total_first_colour_rows / 2; ++i) {
		pixel_map.push(row_of_colour_one_pixels);
	}

	return pixel_map;
}

// =============================================================================
// Build a pixel map that consists of a 16 x 16 square with a bunch of random
// inner squares inside it.
// =============================================================================
function build_random_inner_squares_pixel_map() {
	
	// select total number of random inner squares
	var total_inner_squares = randint(2, 5);
	
	// +++++++++++++++
	// build pixel map
	// +++++++++++++++
	// start with blank pixel map
	var pixel_map = [
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000",
			"0000000000000000"
					];
	// insert the random inner squares by rebuilding the pixel map
	for (var i = 0; i < total_inner_squares; ++i) {
		var top_left_x = randint(1, 14);
		var top_left_y = randint(1, 14);
		var max_possible_width = 15 - top_left_x;
		var max_possible_height = 15 - top_left_y;
		var max_possible_side_length;
		if (max_possible_width < max_possible_height) {
			max_possible_side_length = max_possible_width;
		} else {
			max_possible_side_length = max_possible_height;
		}
		var side_length = randint(1, max_possible_side_length);
		var current_pixel_colour_index = i + 1;
		// insert the square into the pixel map by rebuilding the pixel map
		var rebuilt_pixel_map = [];
		// add all the rows before the first changed row to rebuilt_pixel_map
		for (var row = 0; row < top_left_y; ++row) {
			var row_of_pixels = pixel_map[row];
			rebuilt_pixel_map.push(row_of_pixels);
		}
		// loop through the pixel rows that are to be changed, rebuild them
		// and push them onto rebuilt_pixel_map
		for (var row = top_left_y; row < top_left_y + side_length; ++row) {
			var row_of_pixels = pixel_map[row];
			// rebuild row of pixels
			var rebuilt_row_of_pixels = "";
			for (var col = 0; col < 16; ++col) {
				if ((col >= top_left_x) && (col < top_left_x + side_length)) {
					rebuilt_row_of_pixels += current_pixel_colour_index;
				} else {
					rebuilt_row_of_pixels += '0';
				}
			}
			// stick rebuilt row of pixels in rebuilt_pixel_map
			rebuilt_pixel_map.push(rebuilt_row_of_pixels);
		}
		// loop through the unchanged rows below the inserted square and push
		// them onto rebuilt_pixel_map
		for (var row = top_left_y + side_length; row < 16; ++row) {
			var row_of_pixels = pixel_map[row];
			rebuilt_pixel_map.push(row_of_pixels);
		}
		pixel_map = rebuilt_pixel_map;
	}

	return pixel_map;
}
// =============================================================================
// Called when the SELECT ALL tiles button is pressed.
// =============================================================================
function select_all_tiles() {

	// clear out the global array selected_tiles
	selected_tiles = [];
	
	// stick the indices for all tiles, from 0 to 399, in the global array
	for (var i = 0; i < 400; ++i) {
		selected_tiles.push(i);
	}

	return;
}
// =============================================================================
// Called when the SELECT NONE button is pressed.
// =============================================================================
function unselect_all_tiles() {
	
	// clear out the global array selected_tiles
	selected_tiles = [];
	
	return;
}
// =============================================================================
// =============================================================================
function extract_selected_tiles() {
	
	// code here
	
	return;
}
// =============================================================================
// Called when the random_tile_canvas is clicked.
// =============================================================================
function random_tile_canvas_has_been_clicked(event) {
	
	var canvas = gebi("random_tile_canvas");
	
	// work out the canvas coordinates of the click
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	x = Math.floor(x / 2);
	var y = event.clientY - rect.top;
	y = Math.floor(y / 2);
	cl("x = " + x + ", y = " + y);

	// work out the tile column and row that have been clicked
	var tile_row = Math.floor(y / 16);
	var tile_col = Math.floor(x / 16);
	
	// calculate the index of the tile in the global array tiles, using
	// tile_row and tile_col
	var tile_index = (tile_row * 20) + tile_col;
	cl("tile_index = " + tile_index);
	
	// if the tile hasn't been added to the global array selected_tiles,
	// push it on there, then sort the global array into order
	if (selected_tiles == -1) {
		selected_tiles = [tile_index];
	} else {
		selected_tiles.push(tile_index);
		selected_tiles.sort(function (a, b) {return a - b;});
	}
	
	return;
}
// =============================================================================
// =============================================================================