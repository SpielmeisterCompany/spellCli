define(
	'spell/shared/build/external/xsltproc',
	[
		'fs',
		'os',
		'spell/shared/build/spawnChildProcess'
	],
	function(
		fs,
		os,
		spawnChildProcess
	) {
		'use strict'

		var getXsltProcPath = function( environmentConfig ) {

			if( os.platform() == "win32" ) {
				return path.join( environmentConfig.spellCliPath, 'xsltproc.exe' )
			} else {
				return '/usr/bin/xsltproc'
			}
		}

		return {
			createXsltProcCliParams: function( XslFile, sourceXmlFile, destinationXmlFile, buildOptions ) {
				var cliParams = []

				for( var key in buildOptions ) {
					cliParams.push( '--stringparam' )
					cliParams.push( key )
					cliParams.push( buildOptions[ key ] )
				}

				cliParams.push( '--output' )
				cliParams.push( destinationXmlFile )

				cliParams.push( XslFile )
				cliParams.push( sourceXmlFile )

				return cliParams
			},

			checkPrerequisite: function( environmentConfig, successCb, failCb ) {
				var xsltPath = getXsltProcPath( environmentConfig )

				if ( ! fs.existsSync( xsltPath ) ) {
					failCb( 'Could not find xslt tool in ' + xsltPath )
				}

				successCb();
			},

			run: function(environmentConfig, argv, cwd, next) {
				spawnChildProcess(
					getXsltProcPath(),
					argv,
					{ },
					true,
					next
				)
			}
		}
	}
)