import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title';
import { useLocation, BrowserRouter, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { prettifyNumber } from '../Utils';

function preventDefault(event) {
  event.preventDefault();
}

function addSentimentEmoji(inputVal){
    var value = parseFloat(inputVal)
    //positive score
    if (value >= 0.05){
        var emoji = String.fromCodePoint(0x1F642)
        return emoji + " " + inputVal;
    }
    //neutral score
    else if (value > -.05 && value <0.05){
        var emoji = String.fromCodePoint(0x1F610)
        return emoji + " " + inputVal;
    }
    //negative score
    else{
        var emoji = String.fromCodePoint(0x1F641)
        return emoji + " " + inputVal;
    }
}
export default function AvgReactionsByParticipant() {

    const [averageReactionsParticipantData, setAverageReactionsParticpantData] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    useEffect(() => {

        fetch('/api/reactions/' + conversation_id).then(res => res.json()).then(
        data => {
            setAverageReactionsParticpantData(data["average_reactions_per_message_per_participant"])
            });
        }, [conversation_id]);
    
    function createData(name, value) {
        var newVal = prettifyNumber(value,3);
        return { name, newVal};
        }
          
    for (var key in averageReactionsParticipantData){
        table_objects.push(createData(key, averageReactionsParticipantData[key]))
    }

  return (
    <React.Fragment>
      <Title>Average Reactions per Message By Participant</Title>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Participant</TableCell>
            <TableCell align="right">Average Reactions per Message</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {table_objects.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.newVal}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
