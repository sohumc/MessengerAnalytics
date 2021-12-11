import * as React from 'react';
import Title from '../Title';
import { useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Box } from '@mui/system';
import {ResponsivePie} from '@nivo/pie'
 
export default function TotalMessageChart() {
    const [totalMessageChartData, setTotalMessageChartData] = useState([]);
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");

    useEffect(() => {

      fetch('/api/messageBasicInfo/' + conversation_id).then(res => res.json()).then(
      data => {
        setTotalMessageChartData(data["result"])
      });
      }, [conversation_id])
      
      const MyResponsivePie = (
        <ResponsivePie
            data={totalMessageChartData}
            margin={{ top: 15, right: 10, bottom: 20, left: 10 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
            arcLinkLabelsSkipAngle={8}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={8}
            arcLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 2 ] ] }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}

        />
    )

  return (
    <React.Fragment >
      <Title>Total Messages</Title>

    <Box sx={{height: '90%' }}>
    {MyResponsivePie}
    </Box>


    </React.Fragment>
  );
}
