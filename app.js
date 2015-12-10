(function() {

  return {
    
    defaultState: 'form',

    events: {
      // Framework Events
      'app.activated'      :'onAppActivated',
      // DOM Events
      'click .submit_form' :'onFormSubmitted',
      'click .toggle-app'  : 'toggleAppContainer'
    },

    requests: {
      postTicket: function (ticket) {
        return {
          url         : '/api/v2/tickets.json',
          type        : 'POST',
          dataType    : 'JSON',
          contentType : 'application/JSON',
          data        : JSON.stringify(ticket)
        };
      }
    },

    onAppActivated: function() {
      this.$('.app-container').hide();
      this.$('.toggle-app i').prop('class', 'icon-plus');
    },

    onFormSubmitted: function(e) {
      if (e) {
        e.preventDefault();
      }
      var comment      = this.$('.feedback').val(),
          rating       = this.$('.rating').val(),
          ratingPrefix = this.setting('Rating_tag_prefix'),
          ratingTag;
      if (rating === 'good' || rating === 'bad') {
        if (ratingPrefix) {
          ratingTag = ratingPrefix + '_' + rating;
        } else {
          ratingTag = 'feedback_' + rating;
        }
      }
      var tag    = this.$('.tag').val(),
          ticket = {
            'ticket' : {
              'subject' : comment,
              'comment' : { 'body' : comment },
              'tags'    : [tag || 'feedback', ratingTag]
            }
          };
      if (rating !== null && tag !== null && comment !== '') {
        this.ajax('postTicket', ticket)
          .done( function(response) {
            services.notify('Your feedback has been submitted, thanks!', 'notice');
            this.switchTo('form');
          })
          .fail( function(response){
            services.notify('Failed to submit your feedback, sorry! Try again? The response has been logged to the console.', 'error');
            this.switchTo('form');
          });
      } else {
        services.notify('<p>One of the following is missing:</p><ol><li>Type</li><li>Rating</li><li>Comment</li></ol>', 'error');
      }
    },

    toggleAppContainer: function(){
      var $container = this.$('.app-container'),
          $icon      = this.$('.toggle-app i');
      if ($container.is(':visible')){
        $container.hide();
        $icon.prop('class', 'icon-plus');
      } else {
        $container.show();
        $icon.prop('class', 'icon-minus');
      }
    }

  };

}());
