'use strict';
class FBoperations {
  receivedDeliveryConfirmation(event) {
    if (event.delivery.mids) 
      event.delivery.mids.forEach(messageID => console.log("Received delivery confirmation for message ID: %s", messageID));
      console.log("All message before %d were delivered.", event.delivery.watermark);
  }
  receivedMessageRead(event) {
    console.log("Received message read event for watermark %d and sequence number %d", event.read.watermark, event.read.seq);
  }
}
module.exports = new FBoperations();