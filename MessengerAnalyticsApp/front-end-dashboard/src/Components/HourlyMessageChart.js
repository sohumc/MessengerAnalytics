import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from '../Title';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useLocation, BrowserRouter, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { prettifyNumber } from '../Utils';
import { ResponsiveLine } from '@nivo/line'
import { Box } from '@mui/system';
import {ResponsiveBar} from '@nivo/bar'
const data = [
    {
      "id": "norway",
      "color": "hsl(243, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 25
        }

      ]
    }
  ]
  
export default function HourlyMessageChart() {
    const [hourlyMessageChartData, setHourlyMessageChartData] = useState([]);
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    function createData(x, y) {
        return { x, y};
    }
    useEffect(() => {

      fetch('/api/messagesTimeSeries/' + conversation_id).then(res => res.json()).then(
      data => {
          if(data["messages_per_hour"]["h"]){
              var final_array = []
              var temp_participants = new Set()
              for (var i = 0; i < Object.keys(data["messages_per_hour"]["h"]).length; i++) {
                var temp_dict = {}
                let rowHour = data["messages_per_hour"]["h"][i]
                let rowMessageCount = data["daily_messages_by_sender"]["COUNT(*)"][i]
                temp_dict["Hour"] = rowHour
                temp_dict["count"] = rowMessageCount
                final_array.push(temp_dict)
              }
              setHourlyMessageChartData(final_array)
          }
          });
          
      }, [conversation_id])
      
      var data = [
        {
          "country": "AD",
          "hot dog": 167,
          "hot dogColor": "hsl(25, 70%, 50%)",
          "burger": 34,
          "burgerColor": "hsl(88, 70%, 50%)",
          "sandwich": 66,
          "sandwichColor": "hsl(30, 70%, 50%)",
          "kebab": 58,
          "kebabColor": "hsl(115, 70%, 50%)",
          "fries": 52,
          "friesColor": "hsl(113, 70%, 50%)",
          "donut": 37,
          "donutColor": "hsl(309, 70%, 50%)"
        },
      ]
      const MyResponsiveBar = ({ data /* see data tab */ }) => (
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
    {MyResponsiveBar({ data })}
    </Box>


    </React.Fragment>
  );
}
