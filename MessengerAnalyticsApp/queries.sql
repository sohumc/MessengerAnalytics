-- daily messages by sender
SELECT 
    strftime('%w',messages.timestamp) AS d,
    messages.sender,
    COUNT(*)
FROM messages
WHERE conversation_id='theforgereturns_7kjmx7d_da'
GROUP BY d, messages.sender;

--total messages (monthly)
SELECT 
    strftime('%m-%Y',messages.timestamp) AS m,
    COUNT(*)
FROM messages
WHERE conversation_id='theforgereturns_7kjmx7d_da'
GROUP BY m;

--messages by hour
SELECT 
    strftime('%H',messages.timestamp) AS m,
    COUNT(*)
FROM messages
WHERE conversation_id='theforgereturns_7kjmx7d_da'
GROUP BY m;

--messages with reactions
SELECT 
    sender, content, reactions
FROM messages
WHERE conversation_id='theforgereturns_7kjmx7d_da'
AND messages.reactions IS NOT NULL


--messages with reactions
SELECT 
    sender,
    COUNT(*)
FROM messages
WHERE conversation_id='theforgereturns_7kjmx7d_da'
GROUP BY sender
