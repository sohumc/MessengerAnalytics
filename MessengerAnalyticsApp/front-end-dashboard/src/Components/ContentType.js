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

export default function ContentType() {

    // const { search } = useLocation();
    // let params = useParams();
    const [contentTypes, setContentTypes] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    useEffect(() => {

        fetch('/api/contentType/' + conversation_id).then(res => res.json()).then(
        data => {
            setContentTypes(data)
            });
        }, [conversation_id]);
    
    function createData(name, count) {
        count = prettifyNumber(count);
        return { name, count};
        }
          
    for (var key in contentTypes){
        table_objects.push(createData(key, contentTypes[key]))
    }

  return (
    <React.Fragment>
      <Title>Content Shared Type</Title>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Media Type</TableCell>
            <TableCell align="right"># of Messages</TableCell>
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
