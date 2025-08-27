import { useEffect, useState } from 'react'
import { WebsocketProvider } from 'y-websocket'
import * as Y from 'yjs'

const ydoc = new Y.Doc()
const provider = new WebsocketProvider('ws://localhost:1234', 'my-room', ydoc)

export default function UserCounter() {
  const [users, setUsers] = useState(0)

  useEffect(() => {
    const awareness = provider.awareness

    const update = () => {
      setUsers(awareness.getStates().size)
    }

    awareness.on('change', update)
    update()

    return () => {
      awareness.off('change', update)
    }
  }, [])

  return <p>👥 Users online: {users}</p>
}
