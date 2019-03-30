const extraLife = require('extra-life-api')

async function startPolling(participantId, cb) {
  const initialDonations = await extraLife.getUserDonations(participantId)
  let knownDonationIds = initialDonations.donations.map(donation => donation.donationID)

  console.log(`${knownDonationIds.length} donations found. Polling for more donations now...`)

  setInterval(async () => {
    const newDonations = await extraLife.getUserDonations(participantId)

    newDonations.donations
      .filter(donation => !knownDonationIds.includes(donation.donationID))
      .forEach(donation => {
        knownDonationIds.push(donation.donationID)
        console.log(`New Donation: ${donation}`)
        cb(donation)
      })
  }, 30000)
}

module.exports = {
  onNewDonation(participantId, cb) {
    startPolling(participantId, cb)
  }
}