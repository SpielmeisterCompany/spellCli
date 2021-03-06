define(
	'spell/cli/build/target/web/HTML5Builder',
	[
		'spell/cli/build/createBuilderType',
		'spell/cli/build/createDataFileContent',
		'spell/cli/build/createDebugPath',
		'spell/cli/util/createModuleId',
		'spell/cli/build/processSource',
		'spell/cli/build/loadAssociatedScriptModules',
		'spell/cli/util/writeFile',
		'spell/cli/util/hashModuleId',

		'amd-helper',
		'fs',
		'fsUtil',
		'wrench',
		'path'
	],
	function(
		createBuilderType,
		createDataFileContent,
		createDebugPath,
		createModuleId,
		processSource,
		loadAssociatedScriptModules,
		writeFile,
		hashModuleId,

		amdHelper,
		fs,
		fsUtil,
		wrench,
		path
	) {
		'use strict'


		var build = function( spellCorePath, projectPath, projectLibraryPath, outputPath, projectConfig, library, cacheContent, scriptSource, minify, anonymizeModuleIds, debug, next ) {
			var outputWebPath        = path.join( outputPath, 'web' ),
				outputWebLibraryPath = path.join( outputWebPath, 'library' ),
				outputWebHtml5Path   = path.join( outputWebPath, 'html5' )

			// add component scripts to scriptSource
			var componentScripts = loadAssociatedScriptModules( projectLibraryPath, library.component )

			scriptSource += ',' + processSource(
				_.pluck( componentScripts, 'source' ).join( '\n' ),
				!debug, // minify
				!debug  // anonymizeModuleIds
			)

			// copying all files required by the build to the output directory "build/release/web"
			wrench.mkdirSyncRecursive( outputWebHtml5Path )

			// write data file to "build/release/web/html5/data.js"
			var dataFilePath = path.join( outputWebHtml5Path, 'data.js' )

			writeFile(
				dataFilePath,
				createDataFileContent( scriptSource, cacheContent, projectConfig )
			)

			// engine include goes to "build/release/web/html5/spell.js"
			var outputFilePaths = []

			outputFilePaths.push( [
				createDebugPath( debug, 'spell.debug.js', 'spell.release.js', path.join( spellCorePath, 'lib' ) ),
				path.join( outputWebHtml5Path, 'spell.js' )
			] )

			fsUtil.copyFiles( projectLibraryPath, outputWebLibraryPath, outputFilePaths )

			next()
		}

		var TARGET_NAME  = 'html5',
			HTML5Builder = createBuilderType()

		HTML5Builder.prototype = {
			init : function() {},
			getName : function() {
				return TARGET_NAME
			},
			handlesTarget : function( x ) {
				return 	x === 'all' ||
					x === 'web' ||
					x === TARGET_NAME
			},
			build : function( next ) {
				console.log( 'building for sub-target "' + TARGET_NAME + '"...' )

				build(
					this.environmentConfig.spellCorePath,
					this.projectPath,
					this.projectLibraryPath,
					this.outputPath,
					this.projectConfig,
					this.library,
					this.cacheContent,
					this.scriptSource,
					this.minify,
					this.anonymizeModuleIds,
					this.debug,
					next
				)
			}
		}

		return HTML5Builder
	}
)
