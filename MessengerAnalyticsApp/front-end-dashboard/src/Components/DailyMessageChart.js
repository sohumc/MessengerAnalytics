import * as React from 'react';
import Title from '../Title';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import {ResponsiveBar} from '@nivo/bar'

// d              sender  COUNT(*)
// 0   0        Chris Herzog      2350
// 1   0      Darius Tamboli      1087
// 2   0        Ishvin Sethi       876
// 3   0      Majeed Peffley       721
// 4   0  Mauricio Gutierrez       230
// 5   0          Neil Mehta      4786
// 6   0         Omar Najeed      1340
// 7   0      Sohum Chitalia      1923
// 8   1        Chris Herzog      3344
  
export default function DailyMessageChart() {
    const [dailyMessageChartData, setDailyMessageChartData] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [randomParticipants, setRandomParticipants] = useState([]);
    const [firstRandomParticipant, setFirstRandomParticipant] = useState("");


    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let arrayOfWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    
    useEffect(() => {

        fetch('/api/messagesTimeSeries/' + conversation_id).then(res => res.json()).then(
        data => {
            if(data["daily_messages_by_sender"]["d"]){
                var temp_dict = {}
                var final_array = []
                var temp_participants = new Set()
                for (var i = 0; i < Object.keys(data["daily_messages_by_sender"]["d"]).length; i++) {
                        let rowSenderName = data["daily_messages_by_sender"]["sender"][i]
                        let rowSenderCount = data["daily_messages_by_sender"]["COUNT(*)"][i]
                        let day = data["daily_messages_by_sender"]["d"][i]
                        //day object has been created, append sender data
                        if(day in temp_dict){
                            temp_dict[day][rowSenderName] = rowSenderCount;
                        }
                        else{
                            temp_dict[day] = {}
                            temp_dict[day][rowSenderName] = rowSenderCount;
                        }
                    }

                for (i = 0; i < Object.keys(temp_dict).length; i++) {
                    let dayParticipants = Object.values(temp_dict)[i];
                    Object.keys(dayParticipants).forEach(temp_participants.add, temp_participants)
                }
                for (let [key, value] of Object.entries(temp_dict)) {
                    let day = arrayOfWeekdays[key]
                    var temp_obj = value
                    temp_obj["Day"] = day
                    final_array.push(temp_obj)
                  }
                setParticipants(Array.from(temp_participants))
                setRandomParticipants(Array.from(temp_participants).sort(() => .5 - Math.random()).slice(0, 2));
                setDailyMessageChartData(final_array.reverse());
            }   setFirstRandomParticipant("Sohum")
            });
            
        }, [conversation_id])
        
        const MyResponsiveBar = (
            <ResponsiveBar
                data={dailyMessageChartData}
                keys={participants}
                indexBy="Day"
                margin={{ top: 10, right: 130, bottom: 50, left: 70 }}
                padding={0.3}
                layout="horizontal"
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
                fill={[
                    {
                        match: {
                            id: "{firstRandomParticipant}"
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'Sohum Chitalia'
                        },
                        id: 'lines'
                    }
                ]}
                
                borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 45,
                    legend: 'Number of Messages',
                    legendPosition: 'middle',
                    legendOffset: 43
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendPosition: 'middle',
                    legendOffset: -45
                }}
                labelSkipWidth={16}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                role="application"
            />
        )

  return (
    <React.Fragment >
      <Title>Daily Messages (by Participant)</Title>

    <Box sx={{height: '90%' }}>
    {MyResponsiveBar}
    </Box>


    </React.Fragment>
  );
}
