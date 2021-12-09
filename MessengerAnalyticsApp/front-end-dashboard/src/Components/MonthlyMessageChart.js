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
  
export default function MonthlyMessageChart() {
    const [monthlyMessageChartData, setMonthlyMessageChartData] = useState([]);
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    function createData(x, y) {
        return { x, y};
    }
    useEffect(() => {

        fetch('/api/messagesTimeSeries/' + conversation_id).then(res => res.json()).then(
        data => {
            if(data["messages_per_month"]["m"]){
                for (var i = 0; i < Object.keys(data["messages_per_month"]["m"]).length; i++) {
                        table_objects.push(createData(data["messages_per_month"]["m"][i], data["messages_per_month"]["COUNT(*)"][i]))
                    }
                var chart_data = [{
                    "id": "messages",
                    "data": table_objects
                }]
                setMonthlyMessageChartData(chart_data)
            }
            });
            
        }, [conversation_id])
        
 
  const MyResponsiveLine = ({ data  }) => (
    <ResponsiveLine
        data={monthlyMessageChartData}
        margin={{ top: 10, right: 10, bottom: 25, left: 60 }}
        xScale={{
          type: "time",
          format: "%m-%Y",
          useUTC: false,
        }}
        xFormat="time:%m-%Y"
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Message Count",
          legendOffset: -55,
          legendPosition: "middle"
        }}
        axisBottom={{
          format: "%b %d",
        }}
        colors={{ scheme: "nivo" }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
      />
  )

  return (
    <React.Fragment >
      <Title>Monthly Messages</Title>

    <Box sx={{height: '90%' }}>
    {MyResponsiveLine({ data })}
    </Box>


    </React.Fragment>
  );
}
