const reminder = require('../models/reminder');
const { sendmail } = require('./mail');

const cronFunction = async (req, res) => {
  try{ 
    
    const d = new Date();
    let text = d.toISOString();
    let today = text.slice(0,10);

    const array = await reminder.find();

    array.forEach(element => {
        let reminderDate = element.date.toISOString().slice(0,10);
        if(today === reminderDate) {
          sendmail(
            element.emailID,
            element.subject,
            element.body, 
          );
          if(element.interval === 'Weekly') {
              updateFunction(7, element._id);
          } else if (element.interval === 'Monthly') {
              updateFunction(30, element._id);
          }
        }
    });

    async function updateFunction(days, id) {
      let date = new Date();
      date.setDate(date.getDate() + days);
      const updateValue = await reminder.findByIdAndUpdate(id, {date: date});
      console.log(updateValue);
    }
      
  } catch(error) {
    console.log(error.message);
  }
};

module.exports = { cronFunction };