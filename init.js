plugin.loadMainCSS();
plugin.loadLang();

if(plugin.enabled)
{
	if(plugin.canChangeMenu())
	{
		plugin.createFileMenu = theWebUI.createFileMenu;
		theWebUI.createFileMenu = function( e, id ) 
		{
			if(plugin.createFileMenu.call(this, e, id)) 
			{
				if(plugin.enabled) 
				{
					theContextMenu.add([CMENU_SEP]);
					var fno = null;
					var table = this.getTable("fls");
					if((table.selCount == 1)  && (theWebUI.dID.length==40))
					{
						var fid = table.getFirstSelected();
						if(this.settings["webui.fls.view"])
						{
							var arr = fid.split('_f_');
							fno = arr[1];
						}
						else
						if(!this.dirs[this.dID].isDirectory(fid))
							fno = fid.substr(3);
					}
					theContextMenu.add( [theUILang.RelocateMenuCaption,  (fno==null) ? null : function() {theWebUI.showRelocateDlg(theWebUI.dID ,fno);}] );
				}
				return(true);
			}
			return(false);
		}
	}
	
	theWebUI.showRelocateDlg = function(dID,fno)
	{
		var base_path = $.trim(this.torrents[dID].base_path);
		
		if (this.files[dID][fno].name && this.files[dID][fno].name != this.torrents[dID].name)
			base_path = base_path + "/" + this.files[dID][fno].name;
		
		$('#rel_id').val(dID);
		$('#rel_fno').val(fno);
		$('#rel_source').val(base_path);
		
		$('#rel_debug').html('');
			
		theDialogManager.show( "dlg_relocate" );
		
		//log(dID);
		//log(fno);		
		//log(base_path);
	}
	
	theWebUI.sendRelocate = function()
	{
			
		var id 		= $('#rel_id').val();
		var fno 	= $('#rel_fno').val();
		var dest 	= $('#rel_destination').val();
		var sourc	= $('#rel_source').val();
		var force	= $('#rel_force').val();
		var recheck	= $('#rel_recheck').val();
		
		if (dest == "" || sourc == "") {
			
			$('#rel_debug').html(theUILang.RelocateEmptyDest);
			
		}else{
			
			$('#rel_debug').html('');
		
			var AjaxReq = jQuery.ajax({
				type: "POST",
				timeout: theWebUI.settings["webui.reqtimeout"],
				async : true,
				cache: false,
				//data: "id="+ id +"&fno="+ fno + "&dest=" + dest,
				data: {
						id:id,
						fno:fno,
						dest:dest,
						sourc:sourc,
						force:force
					},
				url : "plugins/relocate/action.php",
				success: function(data){
					if (data == '') {
						theDialogManager.hide("dlg_relocate");
						//askYesNo( theUILang.mediaError, theUILang.badMediaData, "" );
						
						if (recheck == 'on') {
							theWebUI.recheck();
						}
						
						return;
					}
					$("#rel_debug").html(data);
					theDialogManager.center("dlg_relocate");
				}
			});
	
		}
	}
	
}

plugin.onLangLoaded = function()
{
	theDialogManager.make( 'dlg_relocate', theUILang.RelocateDlgCaption,
		"<div class='cont fxcaret'>" +
			"<fieldset>" +
				"<legend>"+theUILang.RelocateFrmSoure+"</legend>"+
				"<input type='text' id='rel_source' name='rel_source' class='TextboxLarge RelFields' autocomplete='off' readonly='true' />"+
			"</fieldset>" +
			"<fieldset>" +
				"<legend>"+theUILang.RelocateFrmDestination+"</legend>"+
				"<input type='text' id='rel_destination' name='rel_destination' class='TextboxLarge RelFields' autocomplete='off' readonly='true'/>"+
				"<input type='button' id='btn_relocate_browse' class='Button' value='...' />" +
				"<input type='hidden' name='rel_id' id='rel_id' />"+
				"<input type='hidden' name='rel_fno' id='rel_fno' />"+
			"</fieldset>" +
			"<fieldset>" +
				"<legend>"+theUILang.RelocateFrmOptions+"</legend>"+
				"<input type='checkbox' id='rel_force' name='rel_force' /> Force (remove existing destination files)"+
				"<input type='checkbox' id='rel_recheck' name='rel_recheck' /> Recheck Torrent"+
			"</fieldset>" +
			"<fieldset>" +
				"<legend>"+theUILang.RelocateFrmDebug+"</legend>"+
				"<div id='rel_debug' class='debug' ></div>"+
			"</fieldset>" +
		"</div>"+
		"<div class='aright buttons-list'>" +
			"<input type='button' value='" + theUILang.ok + "' class='OK Button' id='btn_relocate_ok'" +
				" onclick='theWebUI.sendRelocate(); return(false);' />" +
			"<input type='button' value='"+ theUILang.Cancel + "' class='Cancel Button'/>" +
		"</div>", true);
	if(thePlugins.isInstalled("_getdir"))
	{
		//var btn = new theWebUI.rDirBrowser( 'dlg_relocate', 'rel_destination', 'btn_relocate_browse', 'frame_relocate_browse',true );
		var btn = new theWebUI.rDirBrowser( 'dlg_relocate', 'rel_destination', 'btn_relocate_browse', null,true );
		theDialogManager.setHandler('dlg_relocate','afterHide',function()
		{
			btn.hide();
		});
	}
	else
		$('#btn_relocate_browse').remove();
}

plugin.onRemove = function()
{
	theDialogManager.hide("dlg_relocate");
}