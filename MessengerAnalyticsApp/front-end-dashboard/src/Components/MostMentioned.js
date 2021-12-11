import * as React from 'react';
import Title from '../Title';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { prettifyNumber } from '../Utils';


export default function MostMentioned() {

    // const { search } = useLocation();
    // let params = useParams();
    const [mentionedData, setMentionedData] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    useEffect(() => {

        fetch('/api/conversationStats/' + conversation_id).then(res => res.json()).then(
        data => {
            setMentionedData(data["mentioned_stats"])
            });
        }, [conversation_id]);
    
    function createData(name, count) {
        count = prettifyNumber(count);
        return { name, count};
        }
    var sortable = [];
    for (var mentionedEntry in mentionedData) {
        sortable.push([mentionedEntry, mentionedData[mentionedEntry]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    sortable = sortable.reverse()
    for (var i = 0; i < sortable.length; i++){
        table_objects.push(createData(sortable[i][0], sortable[i][1]))
    }

        
    
  return (
    <React.Fragment>
      <Title>Most Mentioned Participants</Title>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Participant</TableCell>
            <TableCell align="right">Mentions</TableCell>
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
