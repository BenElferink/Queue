# Queue API request/response doc

<br />

## HTTP routes

#### GET `/room/:id` (no-auth)

###### params:

> :id === mongoose.Schema.Types.ObjectId

###### response:

> {<br /> &nbsp;&nbsp; message: "room requested",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; host: {<br /> &nbsp;&nbsp;&nbsp;&nbsp; \_id:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp;&nbsp;&nbsp; username: String,<br />
> &nbsp;&nbsp; }<br /> }

## Socket.io events

#### on `create` (no-auth)

###### body:

> {<br /> &nbsp;&nbsp; username: String,<br /> }

###### response: emit `created` + join(roomId)

> {<br /> &nbsp;&nbsp; message: "created room",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> }

#### on `join` (no-auth)

###### body:

> {<br /> &nbsp;&nbsp; roomId: mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; username:
> String,<br /> }

###### response: emit `joined` + join(roomId)

> {<br /> &nbsp;&nbsp; message: "joined room",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; queue: [<br /> &nbsp;&nbsp;&nbsp;&nbsp; { type:
> mongoose.Schema.Types.ObjectId, ref: 'Quest' }<br /> &nbsp;&nbsp; ],<br /> &nbsp;&nbsp; token:
> ~jsonwebtoken~,<br /> }

#### on `refetch` (auth-TOKEN)

###### body:

> {<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> }

###### response: emit `refetched` + join(roomId)

> {<br /> &nbsp;&nbsp; message: "room fetched",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; queue: [<br /> &nbsp;&nbsp;&nbsp;&nbsp; {<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; from: {<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; _id: mongoose.Schema.Types.ObjectId,<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; username: String,<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; },<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; question:
> String,<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; answer: String,<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; answered: Boolean,<br /> &nbsp;&nbsp;&nbsp;&nbsp; } ...<br />
> &nbsp;&nbsp; ],<br /> }

#### on `ask` (auth-TOKEN)

###### body:

> {<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> &nbsp;&nbsp; question: String,<br /> }

###### response: io.to.(roomId) --> emit `asked`

> {<br /> &nbsp;&nbsp; message: "question asked",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; quest: {<br /> &nbsp;&nbsp;&nbsp;&nbsp; from:
> {<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \_id: mongoose.Schema.Types.ObjectId,<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; username: String,<br /> &nbsp;&nbsp;&nbsp;&nbsp; },<br />
> &nbsp;&nbsp;&nbsp;&nbsp; question: String,<br /> &nbsp;&nbsp;&nbsp;&nbsp; answer: String,<br />
> &nbsp;&nbsp;&nbsp;&nbsp; answered: Boolean,<br /> &nbsp;&nbsp; }<br /> }

#### on `answer` (auth-TOKEN)

###### body:

> {<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> &nbsp;&nbsp; questId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; answer: String,<br /> }

###### response: io.to.(roomId) --> emit `answered`

> {<br /> &nbsp;&nbsp; message: "question answered",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; quest: {<br /> &nbsp;&nbsp;&nbsp;&nbsp; from:
> {<br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; \_id: mongoose.Schema.Types.ObjectId,<br />
> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; username: String,<br /> &nbsp;&nbsp;&nbsp;&nbsp; },<br />
> &nbsp;&nbsp;&nbsp;&nbsp; question: String,<br /> &nbsp;&nbsp;&nbsp;&nbsp; answer: String,<br />
> &nbsp;&nbsp;&nbsp;&nbsp; answered: Boolean,<br /> &nbsp;&nbsp; }<br /> }

#### on `delete-quest` (auth-TOKEN: quest owner or host)

###### body:

> {<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> &nbsp;&nbsp; questId:
> mongoose.Schema.Types.ObjectId,<br /> }

###### response: io.to.(roomId) --> emit `deleted-quest`

> {<br /> &nbsp;&nbsp; message: "question deleted",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> &nbsp;&nbsp; questId: mongoose.Schema.Types.ObjectId,<br />
> }

#### on `delete-room` (auth-TOKEN: host)

###### body:

> {<br /> &nbsp;&nbsp; token: ~jsonwebtoken~,<br /> }

###### response: io.to.(roomId) --> emit `deleted-room`

> {<br /> &nbsp;&nbsp; message: "room deleted",<br /> &nbsp;&nbsp; roomId:
> mongoose.Schema.Types.ObjectId,<br /> }
