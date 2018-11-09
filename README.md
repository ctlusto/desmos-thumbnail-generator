## Desmos Thumbnail Generator

This is a small web app that automates the process of creating many thumbnail
images from a list of saved [Desmos](https://www.desmos.com/calculator) graph
hashes. 

It is intended to be run locally so that generated images are saved to the local
file system, although note that the app still requires a network connection so
that it can (1) load the Desmos API, and (2) fetch saved graph data from the
Desmos production servers.

### Running Locally

1. Make sure you have [Node](https://nodejs.org/en/) installed.
1. Clone this repository.
1. `cd` into the project root and run `npm install` or `yarn install`.
1. Run `npm start` or `yarn start`.
1. Navigate to [localhost:3000](http://localhost:3000/) (though it should open
   automatically).

### Generating Images

Every time a graph is saved on desmos.com, a unique alphanumeric hash is
generated and serves as the final part of the URL used to access that graph. For
example, https://www.desmos.com/calculator/zukjgk9iry points to a graph with
hash `zukjgk9iry `. (SPOILER: It's a parabola).

To create a thumbnail, paste a comma-separated list of graph hashes into the
input field at the top of the page and click the "Generate Thumbnails" button.
You can customize the appearance of the generated thumbnails using the form
controls below the input:

- width: the width, in pixels, of the generated images
- height: the height, in pixels, of the generated images
- high-density: if checked, images will be oversampled by a factor of 2 and
  captured at twice the given dimensions (useful for generating images that will
  look good on high-density displays when scaled down to the given dimensions)

Once processed, images will be saved to a `generated/` folder in the project
root on the local file system. Image file names include the specified dimensions
and oversampling preference, so you can generate several sets of images from the
same list of hashes simply by changing the options and clicking "Generate
Thumbnails" again. There shouldn't be naming collisions unless you actually try
to generate images that already exist.

For example, an image of the graph above (with the default options) would be
saved as `zukjgk9iry_500x500.png`. And a 400x200 high-density image of the same
graph would be saved as `zukjgk9iry_400x200_hi.png`.

### How It Works

Running `npm start` or `yarn start` actually spins up two different servers: an
[Express](http://expressjs.com/) backend responsible for generating the final
images and saving them to the file system, and a [React](https://reactjs.org/)
development server that runs the frontend client. 

The backend server runs on port `5000`. It supports a single `/api/generate`
`POST` route that accepts a PNG data URI and image options and is
responsible for creating the image files.

The frontend client runs on port `3000`. For each graph hash, it requests the
associated JSON graph data from the Desmos servers, sets the state in a local
`Desmos.GraphingCalculator` [instance](https://www.desmos.com/api/v1.2/docs/index.html#document-calculator),
and uses its `.asyncScreenshot()` [method](https://www.desmos.com/api/v1.2/docs/index.html#GraphingCalculator.asyncScreenshot)
to create a PNG data URI. Finally, it `POST`s the image data (via a proxy) to
the backend server in order to generate the final image.

### Troubleshooting

Once you click "Generate Thumbnails," the app displays a table of graph hashes
that updates the app's progress as it processes the hashes. A green checkmark
indicates that the hash was successfully processed, and a red "x" indicates
there was an error somewhere along the way.

If you see *all* red "x"s it means there is either a problem with your internet
connection or with the backend server. Don't try to run the backend and frontend
servers independently: make sure you are running `npm start` or `yarn start`
from the project root, and make sure that the messages `Backend listening on port 5000...`
and `Starting the development server...` have both been logged to the console
window without error.

If you see red "x"s for only a handful of hashes, there could be a few reasons:

1. The graph hash doesn't exist. Try navigating to
   `https://www.desmos.com/calculator/${hash}`. If you get a 404, there is no
   such graph.

1. The data URI was too large for the backend server to handle. The current
   limit is 50mb. If the URI is larger than that, you can try increasing the
   `limit` variable in `server.js`.

1. There was a problem converting the data URI to a PNG file. The server uses the 
   [image-data-uri](https://www.npmjs.com/package/image-data-uri) package to
   decode URIs into image files. Check your server console for helpful error
   messages...although at that point it's probably easier to open the graph on
   desmos.com and take screenshots for a small number of thumbs.
