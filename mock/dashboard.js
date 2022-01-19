import { Mock, Constant } from './_utils'

const { ApiPrefix, Color } = Constant

const Dashboard = Mock.mock({
  numbers: [
    {
      icon: 'pay-circle-o',
      color: Color.green,
      title: 'Online Review',
      number: 222,
    },
    {
      icon: 'team',
      color: Color.blue,
      title: 'New Customers',
      number: 3241,
    },
    {
      icon: 'message',
      color: Color.purple,
      title: 'Active Projects',
      number: 253,
    },
    {
      icon: 'shopping-cart',
      color: Color.red,
      title: 'Referrals',
      number: 4324,
    },
  ],
})

module.exports = {
  [`GET ${ApiPrefix}/dashboard`](req, res) {
    res.json(Dashboard)
  },
}
