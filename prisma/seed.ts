import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { indianStates } from '../src/lib/data'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up TravelTour Pro database with MongoDB...')
  console.log('')

  // Check if database already has data
  const existingStates = await prisma.state.count()
  
  if (existingStates > 0) {
    console.log('✅ Database already has data!')
    console.log(`   - ${existingStates} states`)
    console.log(`   - ${await prisma.destination.count()} destinations`)
    console.log(`   - ${await prisma.user.count()} users`)
    return
  }

  console.log('📦 Seeding database...')

  // Create states and destinations
  for (const stateData of indianStates) {
    // Create state first
    const state = await prisma.state.create({
      data: {
        name: stateData.name,
        description: stateData.description,
        image: stateData.image,
      }
    })

    console.log(`✓ Created state: ${state.name}`)

    // Create destinations for this state
    for (const dest of stateData.destinations) {
      await prisma.destination.create({
        data: {
          name: dest.name,
          stateId: state.id,
          description: dest.description,
          highlights: JSON.stringify(dest.highlights),
          rating: dest.rating,
          price: dest.price,
          image: dest.image,
          mapEmbedUrl: dest.mapEmbedUrl,
        }
      })
    }
  }

  // Create admin user
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@traveltour.com',
      password: hashedAdminPassword,
      role: 'ADMIN'
    }
  })
  console.log('✓ Created admin user: admin@traveltour.com')

  // Create test user
  const hashedUserPassword = await bcrypt.hash('test123', 10)
  await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@test.com',
      password: hashedUserPassword,
      phone: '9876543210',
      role: 'USER'
    }
  })
  console.log('✓ Created test user: test@test.com')

  console.log('')
  console.log('🎉 Database setup complete!')
  console.log('')
  console.log('📋 Login Credentials:')
  console.log('   User:  test@test.com / test123')
  console.log('   Admin: admin@traveltour.com / admin123')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
