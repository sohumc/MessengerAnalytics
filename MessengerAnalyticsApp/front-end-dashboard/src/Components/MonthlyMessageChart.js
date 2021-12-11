import * as React from 'react';
import Title from '../Title';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line'
import { Box } from '@mui/system';

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
        
 
  const MyResponsiveLine = (
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
    {MyResponsiveLine}
    </Box>


    </React.Fragment>
  );
}
