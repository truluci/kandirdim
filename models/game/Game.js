{
  _id: mongoid
  users: [mongoid, mongoid]
  is_finished: boolean
  messages: [
    {
      user: mongoid,
      message: string,
      created_at: date
    },
    {
      user: mongoid,
      message: string,
      created_at: date
    }
  ]
  created_at: date
}
