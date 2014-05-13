(function() {

  return {
    defaultState: 'form',
    events: {
      'app.activated':'onAppActivated',
      'click .submit_form':'onFormSubmitted'
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
        
      var ticketRaw = {'ticket':{'subject':comment,'comment': { 'body': comment }, 'tags':[this.setting('Tag') || 'feedback', ratingTag]}};
      var ticketString = JSON.stringify(ticketRaw);

      this.ajax('postTicket', ticketString).done( function(response) {
        services.notify(this.setting('Success_notice') || 'Your feedback has been submitted, thanks!');
        this.switchTo('form');
      });
    },
    onSubmitFailed: function(response) {
      services.notify( this.setting('Fail_notice') || 'Failed to submit your feedback, sorry! Try again? The response has been logged to the console.', 'error');
      console.log(response);
      
    }
  };

}());
