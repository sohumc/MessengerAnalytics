import * as React from 'react';
import Title from '../Title';
import { useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { prettifyNumber } from '../Utils';

export default function MessageWordsData() {

    const [messageWordsData, setMessageWordsData] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    let table_objects = []
    useEffect(() => {

        fetch('/api/messageWordData/' + conversation_id).then(res => res.json()).then(
        data => {
            setMessageWordsData(data)
            });
        }, [conversation_id]);
    
    function createData(name, value) {
        value = prettifyNumber(value,2);
        return { name, value};
        }
          
    for (var key in messageWordsData){
        table_objects.push(createData(key, messageWordsData[key]))
    }

  return (
    <React.Fragment>
      <Title>Message Words Data</Title>
      <Table  aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stat</TableCell>
            <TableCell align="right">Value</TableCell>
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
              <TableCell  
                style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      maxWidth: "100px"
                    }}
                align="right">{row.value}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
