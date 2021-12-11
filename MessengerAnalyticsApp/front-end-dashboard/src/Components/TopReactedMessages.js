import * as React from 'react';
import Title from '../Title';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

export default function TopReactedMessages() {

    const [topReactedMessages, setTopReactedMessages] = useState({});
    let conversation_id = useLocation()['pathname'].replace("/conversation/","");
    useEffect(() => {

        fetch('/api/reactions/' + conversation_id).then(res => res.json()).then(
        data => {
            setTopReactedMessages(data["most_reacted_messages_per_participant"])
            });
    }, [conversation_id]);
    
    function createData(name, numTopMessages, senderReactionData) {
        var reactionObjects = []
        for (var messageIndex in Object.values(senderReactionData)){
            var messageObject = senderReactionData[messageIndex]
            var tempObject = {
                message: messageObject["message"]
            }
            if(!tempObject["message"]){
                tempObject["message"] = "Media Object"
            }
            tempObject["reaction_count"] = messageObject["reaction_count"]
            var tempReactionsDict = messageObject["reactions"]
            var reactionStr = ""
            for (var i in tempReactionsDict){
                reactionStr += i + ":" + tempReactionsDict[i] + ", "
            }
            reactionStr = reactionStr.slice(0, -2)
            tempObject["reactions"] = reactionStr
            reactionObjects.push(tempObject)
        }
        return {
            name,
            numTopMessages,
            history: reactionObjects,
        };
    }
          
        function Row(props) {
            const { row } = props;
            const [open, setOpen] = React.useState(false);
            return (
                <React.Fragment>
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                    <TableCell sx={{ padding: '0px', borderBottom: 'unset' }}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                    {row.name}
                    </TableCell>
                    <TableCell >{row.numTopMessages}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Table size="small" aria-label="purchases">
                            <TableHead>
                            <TableRow sx={{ borderBottom: 'unset' }}>
                                <TableCell>Message</TableCell>
                                <TableCell>Reaction Count</TableCell>

                                <TableCell>Reactions</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {row.history.map((historyRow) => (
                                <TableRow key={historyRow.message}>
                                <TableCell component="th" scope="row">
                                    {historyRow.message}
                                </TableCell>
                                <TableCell>{historyRow.reaction_count}</TableCell>
                                <TableCell>{historyRow.reactions}</TableCell>

                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Collapse>
                    </TableCell>
                </TableRow>
                </React.Fragment>
            );
        }
          
        Row.propTypes = {
            row: PropTypes.shape({
                name: PropTypes.string.isRequired,
                history: PropTypes.arrayOf(
                    PropTypes.shape({
                        message: PropTypes.string,
                        reaction_count: PropTypes.number,
                        reactions: PropTypes.string,
                    }),
                ),
            }).isRequired,
        };
        var rows = []
        for (var senders in topReactedMessages){
            rows.push(createData(senders, topReactedMessages[senders].length,  topReactedMessages[senders]))
        }


  return (
    <React.Fragment>
      <Title>Most Reacted To Messages by Sender</Title>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Sender</TableCell>
            <TableCell># of Top Messages</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
      
    </React.Fragment>
  );
}
