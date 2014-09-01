/* 
	This is completely a super quick draft, there is a lot to refactor and improve

	The purpose of this script is to preload gifs in a batch fashion and then
	displaying them to the user on at a time.

	When the user reaches the middle of the latest batch then the program
	will attempt to load a new one if it not exceed the max amount of gifs.

*/


var GIF_NUMBER = 11;
var BATCH_SIZE = 5;
var batch_index = 0;

var loaded_gifs_length = 0;


function generate_random_array (MAX) {
	
	var result = [];
	var already_used = [];
	
	var i = 0;
	var new_number;

	while(i < MAX){
		new_number = Math.round(Math.random() * 10 );
		if ( !already_used[new_number] ){
			result[i] = new_number;
			i++;
			already_used[new_number] = true;
		}
		
	}



	return result;
}


/*NEW VERSION for CSS backgrounds*/

function fetch_gif_batch(array_of_ids) {

	var promises = [];

	array_of_ids.forEach(function (e) {
		var pro = new Promise(function (resolve, reject) {
			var gif = document.createElement('img');
			gif.src = "gif/" + e + ".gif";
			gif.addEventListener('load', function () { resolve(gif.src) } , false);
			gif.addEventListener('error', reject, false);
			//actually load de gif
			gif.src = "gif/" + e + ".gif";
		});

		promises.push(pro);

		
	})

	loaded_gifs_length += BATCH_SIZE;
	return (loaded_gifs || []).concat(promises);
}




var array_of_ids = generate_random_array(GIF_NUMBER);


var loaded_gifs = fetch_gif_batch(  array_of_ids.slice(batch_index * BATCH_SIZE, BATCH_SIZE)  );





Promise.all(loaded_gifs).then(function (gif_ids) {	
	show_gif(gif_ids[0])
})


var canvas = document.getElementsByTagName('main')[0];


var index = 1;
//show loaded gifs in order after click (they are already random)
canvas.addEventListener('click', function () {

	Promise.all(loaded_gifs).then(function (gifs) {
		var gif_id = gifs[index];

		show_gif(gif_id);	
		index = (index + 1) % loaded_gifs_length;
		update();
		//debugger;
	})
	
	
});

function show_gif(url) {
	canvas.style.backgroundImage = "url(" + url + ")";	
}

function update() {

	//Only if the gif displayed is at the half or more of the latest batch,
	//if so, then load a new batch in order to show the user later

	// ((batch_index+2) * BATCH_SIZE) is an estimation of the end of the batch in case of requiring a new one
	// and in base of that we know if the hipotetical new batch will exceed the number of gifs or not
	if ((index >= (batch_index * BATCH_SIZE + BATCH_SIZE/2)) && (((batch_index+2) * BATCH_SIZE) <= GIF_NUMBER))  {
		batch_index++;
		var start = batch_index * BATCH_SIZE;
		var end = start + BATCH_SIZE;
		loaded_gifs = fetch_gif_batch(  array_of_ids.slice(start, end)  );
	}

}