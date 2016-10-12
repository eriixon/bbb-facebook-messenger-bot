"use strict";
let bph = require('../constants/botphrases');
let rmg = require('../constants/ratingimgs');
let note = require('../utilities/notifications');

  class ScoreCardMaker {
    cardPool(list){
      let newList=[];
      list=(list.length>10)?list.slice(0,10):list;
      list.forEach(item=>newList.push(this.scoreCard(item)));
      return newList;
    }
    scoreCard(curr) {
        let obj = {title: curr.OrganizationName, buttons: [] };
        if (curr.RatingIcons.length !== 0) obj.image_url = rmg[curr.RatingIcons[0].Url.substring(31).slice(0, -4)];
        else {
          obj.image_url = rmg['none'];
          note.badDataEmail({ name: curr.OrganizationName, lostdata: "no rating", link: curr.ReportURL, city: curr.City, state: curr.StateProvince });
        };
        // buttons
        if (curr.ReportURL) obj.buttons.push({ type: "web_url", url: curr.ReportURL, title: "BBB Business Review" });
        else note.badDataEmail({ name: curr.OrganizationName, lostdata: "no BBB link", link: "no data", city: curr.City, state: curr.StateProvince });
        if (curr.BusinessURLs) obj.buttons.push({ type: "web_url", url: curr.BusinessURLs[0], title: "Business Site" });
        // if the card does not have link - delete buttons and add message
        if (obj.buttons.length < 1) {
          delete obj.buttons;
          obj.subtitle = bph.BAD_DATA;
          obj.item_url = "http://www.bbb.org/"
        };
        return obj;
    }
  };
  module.exports = new ScoreCardMaker();