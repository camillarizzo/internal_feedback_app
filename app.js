(function() {

  return {
    defaultState: 'form',
    events: {
      'app.activated':'onAppActivated',
      'click .submit_form':'onFormSubmitted',
      'postTicket.fail':'onSubmitFailed'
    },

    requests: {
      postTicket: function (ticket) {
        return {
          url: '/api/v2/tickets.json',
          type: 'POST',
          dataType: 'JSON',
          contentType: 'application/JSON',
          proxy_v2: true,
          data: ticket
        };
      }
    },

    onAppActivated: function(e) {

    },
    onFormSubmitted: function(e) {
      if(e) {e.preventDefault();}

      var comment = this.$('.feedback').val();
      var rating = this.$('.rating').val();
      var ratingPrefix = this.setting('Rating_tag_prefix');
      var ratingTag;
      if(rating == 'good' || rating == 'bad') {
        if(ratingPrefix) {
          ratingTag = ratingPrefix + '_' + rating;
        } else {
          ratingTag = 'feedback_' + rating;
        }
      }
      var tag = this.$('.tag').val();
      var ticketRaw = {'ticket':{'subject':comment,'comment': { 'body': comment }, 'tags':[tag || 'feedback', ratingTag]}};
      var ticketString = JSON.stringify(ticketRaw);
      if(tag) {
        this.ajax('postTicket', ticketString).done( function(response) {
          services.notify(this.setting('Success_notice') || 'Your feedback has been submitted, thanks!');
          this.switchTo('form');
        });
      } else {
        this.missingField("Feedback type");
      }
      
    },
    missingField: function(field) {
      services.notify('You missed the required field "' + field + '" :( Try again?', 'error');
    },
    onSubmitFailed: function(response) {
      services.notify( this.setting('Fail_notice') || 'Failed to submit your feedback, sorry! Try again? The response has been logged to the console.', 'error');
      console.log(response);
      
    }
  };

}());
