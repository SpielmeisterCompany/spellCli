define(
	'spell/shared/build/createLibraryPath',
	[
		'path'
	],
	function(
		path
	) {
		'use strict'


		return function( libraryPath ) {
			return libraryPath.split( path.sep ).join( '/' )
		}
	}
)
