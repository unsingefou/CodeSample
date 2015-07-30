$(function(){
    //setup the two sortable lists
    $('.sortable').sortable({
        cursor: "move",
        placeholder: 'placeholder',
        connectWith: '.sortable',
        update: function(){
            //when the list changes in any fashion, enable both save and cancel buttons
            $('#save-list-' + $(this).attr('data-list-id')).prop('disabled', false);
            $('#cancel-' + $(this).attr('data-list-id')).prop('disabled', false);
        },
        receive: function(e, ui){
            var library_id = $(ui.item).attr('data-library-id');
            //check this list for the id that is being added
            if($(this).find("[data-library-id='" + library_id + "']").length > 1){
                alert((ui.item.children('span').html() + " has already been added to the list and will not be added again."));
                ui.sender.sortable("cancel");
            }else{
                //when the id is not found
                //enable the cancel button
                $('#cancel-' + $(this).attr('data-list-id')).prop('disabled', false);
                //make sure the data is set to copy
                ui.sender.data('copied', true);

                //now check the li to see if it already has the minus icon
                if($(ui.item).children("i").length === 0){
                    $('.fa-minus-circle').first().clone().click(removeFromList).appendTo($(ui.item));
                }
            }
        }
    }).mousedown(function(){
        document.activeElement.blur();
    }).disableSelection();

    //setup the search result list
    $('.search-results').sortable({
        connectWith: '.sortable',
        cursor: "move",
        placeholder: 'placeholder',
        helper: function(e, li){
            this.copyHelper = li.clone().insertAfter(li);
            $(this).data('copied', false);
            return li.clone();
        },
        stop: function(){
            var copied = $(this).data('copied');
            if(!copied){
                this.copyHelper.remove();
            }
            this.copyHelper = null;
        }
    }).mousedown(function(){
        document.activeElement.blur();
    });

    //add functionality to the minus icon on each item in the list
    $('.fa-minus-circle').click(removeFromList);

    //add functionality to the icon for editing titles
    $('.fa-edit').click(function(){
        $(this).toggleClass('fa-edit').toggleClass('fa-save');
        editTitle($(this).prev());
    });

    //add functionality for the 'enter' key when title input is focused
    $('h1 input').blur(function(){
        saveTitle($(this));
        $(this).next().toggleClass('fa-edit').toggleClass('fa-save');
    }).keypress(function(e){
        if(e.which === 13){
            $(this).blur();
        }
    });

    //add functionality for the 'enter' key when search input is focused
    $('.search-field').keypress(function(e){
        if(e.which === 13){
            getSearchResults();
        }
    });

    //add functionality to the save button
    $('.save-button').click(function(){
        updatePosition($(this));
    });
});

/**
 * @description - Enabled and focus the selected input field
 * 
 * @param {jquery selector} input - input field 
 */
function editTitle(input){
    input.attr('data-old-name', input.val());
    input.prop('disabled', false).focus();
}

/**
 * @description - Send an ajax request to the server to update the name of
 * the list
 * 
 * @param array input contains the name and the id of the list to be updated
 */
function saveTitle(input){
    input.prop('disabled', true);
    if(input.attr('data-old-name') !== input.val()){
        $.ajax({
            url: '/admin/store/renamelist',
            type: 'POST',
            data: {
                'list_id': input.attr('data-list-id'),
                'list_name': input.val()
            },
            success: function(response){

            }
        });
    }
}

/**
 * @description - Toggle the spinner while the page reloads.
 * 
 * @param {jquery selector object} button - jquery selector of the clicked button
 */
function reload(button){
    $(button).children('i').show();
    window.location.reload();
}

/**
 * @description - Find the list id, then find the order of each item in the list, finally send
 * and ajax request to update the order in the database.  If a new item is added
 * to the list, it will be added to the db.
 * 
 */
function updatePosition(save_button){
    //get the list id from the ul element
    var list_id = save_button.attr('data-list-id');

    //get all the ids of the items in the list
    var library_ids = [];
    $('#list-' + list_id + " .list-item").each(function(){
        library_ids.push(parseInt($(this).attr('data-library-id')));
    });

    //build the data object
    var data = {
        'list_id': list_id,
        'library_ids': library_ids
    };
    //submt the list via ajax to update the positions
    save_button.children('.fa-spinner').show();
    $.ajax({
        url: '/admin/store/updatecuratedlistposition',
        type: 'POST',
        data: {
            'list_id': list_id,
            'library_ids': library_ids
        },
        success: function(response){
            //hide the spinner on the save button and disable save and cancel
            save_button.prop('disabled', true).children('.fa-spinner').hide();
            $('#cancel-' + list_id).prop('disabled', true);
        }
    });
}
/**
 * @description Send and Ajax request to obtain all of the content items matching the searchinput.
 * When the response comes back, use the jquery template li, found in the html, to build and append
 * all of the content items.
 */
function getSearchResults(){
    var icon = $('.search-button').children('i');
    //change the search icon to a spinner
    icon.toggleClass('fa-search').toggleClass('fa-spinner');
    //send the request
    $.ajax({
        url: '/admin/store/getsearchresults',
        type: 'POST',
        data: {
            'search': $('.search-field').val()
        },
        success: function(response){
            //change the spinner back to search
            icon.toggleClass('fa-search').toggleClass('fa-spinner');
            $('.search-results').empty();
            var results = JSON.parse(response);
            //for every item, use clone the jquery template and attach it to the search results
            for(var index in results){
                var template = $('.jquery-templates li').clone();
                template.attr('data-library-id', results[index]['library_id']);
                template.html(results[index]['title']);
                $('.search-results').append(template);
            }
        }
    });
}

/**
 * @description - Simply remove the item from the list and then enable the
 * save button.
 */
function removeFromList(){
    var list_id = $(this).parent().parent().attr('data-list-id');
    var list_item = $(this).parent();
    list_item.remove();
    $('#save-list-' + list_id).prop('disabled', false);
    $('#cancel-' + list_id).prop('disabled', false);
}