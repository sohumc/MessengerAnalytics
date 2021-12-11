import * as React from 'react';
import Title from '../Title';
import { useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import {ResponsiveBar} from '@nivo/bar'

  
export default function HourlyMessageChart() {
    const [hourlyMessageChartData, setHourlyMessageChartData] = useState([]);
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");

    useEffect(() => {

      fetch('/api/messagesTimeSeries/' + conversation_id).then(res => res.json()).then(
      data => {
        let hourly_message_data = data["messages_per_hour"]
        var final_array = []
        console.log(data["messages_per_hour"])
        for (var i = 0; i < Object.keys(hourly_message_data["h"]).length; i++) {
          var temp_dict = {}
          let rowHour = hourly_message_data["h"][i]
          let rowMessageCount = hourly_message_data["COUNT(*)"][i]
          temp_dict["Hour"] = rowHour
          temp_dict["count"] = rowMessageCount
          final_array.push(temp_dict)
        }
        setHourlyMessageChartData(final_array)
      });
      }, [conversation_id])
      
      const MyResponsiveBar = (
          <ResponsiveBar
              data={hourlyMessageChartData}
              keys={[ 'count' ]}
              indexBy="Hour"
              margin={{ top: 10, right: 10, bottom: 45, left: 60 }}
              padding={0.3}
              layout="vertical"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              defs={[
                  {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: '#38bcb2',
                      size: 4,
                      padding: 1,
                      stagger: true
                  },
                  {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: '#eed312',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10
                  }
              ]}
              
              borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 45,
                  legend: 'Hour of the Day',
                  legendPosition: 'middle',
                  legendOffset: 35
              }}
              axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legendPosition: 'middle',
                  legend: 'Message Count',
                  legendOffset: -55
              }}
              labelSkipWidth={16}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
              role="application"
          />
      )

  return (
    <React.Fragment >
      <Title>Hourly Messages</Title>

    <Box sx={{height: '90%' }}>
    {MyResponsiveBar}
    </Box>


    </React.Fragment>
  );
}
