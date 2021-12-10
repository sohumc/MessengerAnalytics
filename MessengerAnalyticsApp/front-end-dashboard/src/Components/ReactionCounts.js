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

export default function ReactionCounts() {

    // const { search } = useLocation();
    // let params = useParams();
    const [reactionCounts, setReactionCounts] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    useEffect(() => {

        fetch('/api/reactions/' + conversation_id).then(res => res.json()).then(
        data => {
            setReactionCounts(data["total_reaction_counts"])
            });
        }, [conversation_id]);
    
        function createData(name, count) {
            var count = prettifyNumber(count);
            return { name, count};
            }
        for (var row in reactionCounts){
            table_objects.push(createData(reactionCounts[row][0], reactionCounts[row][1]))
        }
    

  return (
    <React.Fragment>
      <Title>Top Used Reactions</Title>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Reaction</TableCell>
            <TableCell align="right">Count</TableCell>
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
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
