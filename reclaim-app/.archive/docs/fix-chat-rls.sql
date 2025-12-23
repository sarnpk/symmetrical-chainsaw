-- Fix messages_select_participant policy
DROP POLICY IF EXISTS messages_select_participant ON community_messages;

CREATE POLICY messages_select_participant ON community_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM community_conversation_participants p
    WHERE p.conversation_id = community_messages.conversation_id
    AND p.user_id = auth.uid()
  )
);
