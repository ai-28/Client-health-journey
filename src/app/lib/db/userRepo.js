import { sql } from './postgresql';
const crypto = require('crypto');

const HASH_ITERATIONS = 10000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

function generateSalt() {
  return crypto.randomBytes(16).toString('base64');
}
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('base64');
}


export const userRepo = {
  resetPassword,
  updateCoach,
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  deleteCoach,
  authenticate,
  getUserById,
  getUserByEmail,
  getCoachesByClinicId,
  getNumCoachesByClinicId,
  createClientUser,
  updateCoachNum,
  getCoaches,
  getNumClinics,
  getNumTotalCoaches,
  getClinicAdmin,
  deleteClinicMembers,
  deleteClient,
};

async function getAdminUsers() {
  return await sql`SELECT * FROM "User" WHERE "role" = 'admin'`;
}

async function deleteClient(email) {
  const [deleted] = await sql`DELETE FROM "User" WHERE "email" = ${email} RETURNING *`;
  const [deletedClient] = await sql`DELETE FROM "Client" WHERE "email" = ${email} RETURNING *`;
  const [deleteCheckIn] = await sql`DELETE FROM "CheckIn" WHERE "email" = ${email} RETURNING *`;
  const [deleteMessage] = await sql`DELETE FROM "Message" WHERE "sender" = ${email} OR "receiver" = ${email} RETURNING *`;
  const [deleteNotification] = await sql`DELETE FROM "Notification" WHERE "email" = ${email} RETURNING *`;
  const [deleteAIReview] = await sql`DELETE FROM "AIReview" WHERE "email" = ${email} RETURNING *`;
  return deleted || null;
}

async function createAdminUser(name, email, phoneNumber, role, password, clinic, options = {}) {
  const existing = await sql`SELECT * FROM "User" WHERE "email" = ${email} LIMIT 1`;
  if (existing.length > 0) return existing[0];

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const [user] = await sql`
    INSERT INTO "User" ("name", "email", "phoneNumber", "role", "password", "clinic", "salt")
    VALUES (${name}, ${email}, ${phoneNumber}, ${role}, ${hashedPassword}, ${clinic}, ${salt})
    RETURNING *
  `;
  return user;
}

async function createClientUser(name, email, phoneNumber, role, password, clinic, coachId, options = {}) {
  const existing = await sql`SELECT * FROM "User" WHERE "email" = ${email} LIMIT 1`;
  if (existing.length > 0) return existing[0];

  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  const [user] = await sql`
    INSERT INTO "User" ("name", "email", "phoneNumber", "role", "password", "clinic", "coachId", "salt")
    VALUES (${name}, ${email}, ${phoneNumber}, ${role}, ${hashedPassword}, ${clinic}, ${coachId}, ${salt})
    RETURNING *
  `;
  return user;
}

async function updateAdminUser(id, name, email, phone, role, isActive, origin) {
  const [updated] = await sql`
    UPDATE "User"
    SET "name" = ${name},
        "email" = ${email},
        "phoneNumber" = ${phone},
        "role" = ${role},
        "isActive" = ${isActive}
    WHERE "id" = ${id}
    RETURNING *
  `; if (role === "coach" || role === "client") {
    // Update CheckIn table
    const [dd] = await sql`
      UPDATE "CheckIn"
      SET "email" = ${email}
      WHERE "email" = ${origin}
      RETURNING *
    `;

    // Update Message table: update both sender and receiver if they match origin
    const [mes] = await sql`
      UPDATE "Message"
      SET
        "sender" = CASE WHEN "sender" = ${origin} THEN ${email} ELSE "sender" END,
        "receiver" = CASE WHEN "receiver" = ${origin} THEN ${email} ELSE "receiver" END
      WHERE "sender" = ${origin} OR "receiver" = ${origin}
      RETURNING *
    `;

    // Update Notification table
    const [No] = await sql`
      UPDATE "Notification"
      SET "email" = ${email}
      WHERE "email" = ${origin}
      RETURNING *
    `;
  }

  if (role === "client") {
    // Update Client table (removed trailing comma)
    const [cli] = await sql`
      UPDATE "Client"
      SET
        "email" = ${email},
        "phone" = ${phone}
      WHERE "email" = ${origin}
      RETURNING *
    `;
  }



  return updated || null;
}

async function deleteAdminUser(id) {
  const [deleted] = await sql`
    DELETE FROM "User" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function authenticate(email, inputPassword) {
  // Fetch user by email
  const result = await sql`SELECT * FROM "User" WHERE email = ${email}`;
  const user = result[0];

  if (!user) {
    throw new Error("Invalid email");
  }

  // Hash input password with stored salt
  const inputHash = hashPassword(inputPassword, user.salt);

  if (inputHash !== user.password) {
    return null; // Password mismatch
  }

  if (!user.isActive) {
    throw new Error("User is not active");
  }

  // Return user object without sensitive fields
  const { password, salt, ...safeUser } = user;
  return safeUser;
}

async function getUserById(id) {
  if (!id) {
    throw new Error('User ID is required');
  }

  try {
    const users = await sql`
      SELECT 
        u.*,
        row_to_json(c) AS clinicDetail
      FROM "User" u
      LEFT JOIN "Clinic" c ON u."clinic" = c."id"
      WHERE u."id" = ${id}
      LIMIT 1
    `;

    if (!users || users.length === 0) {
      return null;
    }

    return users[0];
  } catch (error) {
    console.error('Error in getUserById:', error);
    throw new Error('Failed to fetch user');
  }
}

async function getUserByEmail(email) {
  const users = await sql`
  SELECT 
    u.*,
    row_to_json(c) AS clinicDetail
  FROM "User" u
  LEFT JOIN "Clinic" c ON u."clinic" = c."id"
  WHERE u."email" = ${email}
  LIMIT 1
`;
  return users[0] || null;
}

async function getCoachesByClinicId(clinicId) {
  const coaches = await sql`
    SELECT 
      u.*,
      row_to_json(c) AS clinicDetail
    FROM "User" u
    LEFT JOIN "Clinic" c ON u."clinic" = c."id"
    WHERE u."role" = 'coach' AND u."clinic" = ${clinicId}
  `;
  return coaches;
}


async function getNumCoachesByClinicId(clinicId) {
  const result = await sql`
    SELECT COUNT(*)::int AS count
    FROM "User"
    WHERE "role" = 'coach' AND "clinic" = ${clinicId}
  `;
  return result[0]?.count || 0;
}

async function updateCoach(id, name, email, phone) {
  const [updated] = await sql`
    UPDATE "User"
    SET "name" = ${name},
        "email" = ${email},
        "phoneNumber" = ${phone}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated || null;
}

async function deleteCoach(id) {
  const [deleted] = await sql`
    DELETE FROM "User" WHERE "id" = ${id} RETURNING *
  `;
  return deleted || null;
}

async function resetPassword(id, newPassword) {
  const users = await sql`SELECT * FROM "User" WHERE "id" = ${id} LIMIT 1`;
  if (users.length === 0) return null;

  const salt = generateSalt();
  const hashedPassword = hashPassword(newPassword, salt);

  const [updated] = await sql`
    UPDATE "User"
    SET "password" = ${hashedPassword}, "salt" = ${salt}
    WHERE "id" = ${id}
    RETURNING *
  `;
  return updated || null;
}

async function updateCoachNum(clinicId) {
  const [updated] = await sql`
    UPDATE "Clinic"
    SET "coaches" = COALESCE("coaches", 0) + 1
    WHERE "id" = ${clinicId}
    RETURNING *
  `;
  return updated || null;
}

async function getCoaches() {
  const coaches = await sql`
    SELECT 
      u.*,
      row_to_json(c) AS clinicDetail
    FROM "User" u
    LEFT JOIN "Clinic" c ON u."clinic" = c."id"
    WHERE u."role" = 'coach'
  `;
  return coaches;
}

async function getNumClinics() {
  const result = await sql`SELECT COUNT(*)::int AS count FROM "Clinic"`;
  return result[0]?.count || 0;
}

async function getNumTotalCoaches() {
  const result = await sql`
    SELECT COUNT(*)::int AS count FROM "User" WHERE "role" = 'coach'
  `;
  return result[0]?.count || 0;
}

async function getClinicAdmin(clinicId) {
  const admins = await sql`
    SELECT * FROM "User"
    WHERE "role" = 'clinic_admin' AND "clinic" = ${clinicId}
    LIMIT 1
  `;
  return admins[0] || null;
}

async function deleteClinicMembers(clinicId) {
  try {
    console.log(`Starting deletion of clinic members for clinic: ${clinicId}`);

    // Use a transaction to ensure data consistency
    return await sql.begin(async (sql) => {
      // Get all users from this clinic
      const users = await sql`
        SELECT "id", "email", "role" FROM "User" 
        WHERE "clinic" = ${clinicId}
      `;

      console.log(`Found ${users.length} users to delete`);

      // Handle each user type appropriately
      for (const user of users) {
        console.log(`Processing user: ${user.email} (${user.role})`);

        if (user.role === 'coach') {
          // For coaches, first handle their clients
          const clientUpdate = await sql`
             UPDATE "Client" 
             SET "coachId" = NULL 
             WHERE "coachId" = ${user.id}
           `;
          console.log(`Updated ${clientUpdate.length} clients for coach ${user.email}`);

          // Handle check-ins that reference this coach
          const checkInUpdate = await sql`
             UPDATE "CheckIn" 
             SET "coachId" = NULL 
             WHERE "coachId" = ${user.id}
           `;
          console.log(`Updated ${checkInUpdate.length} check-ins for coach ${user.email}`);

          // Delete daily messages that reference this user
          const dailyMessageDelete = await sql`
             DELETE FROM "DailyMessage" 
             WHERE "userId" = ${user.id}
           `;
          console.log(`Deleted ${dailyMessageDelete.length} daily messages for coach ${user.email}`);
        }

        if (user.role === 'client') {
          // For clients, delete related data first
          const checkInDelete = await sql`
               DELETE FROM "CheckIn" 
               WHERE "email" = ${user.email}
             `;
          console.log(`Deleted ${checkInDelete.length} check-ins for client ${user.email}`);

          const messageDelete = await sql`
               DELETE FROM "Message" 
               WHERE "sender" = ${user.email} OR "receiver" = ${user.email}
             `;
          console.log(`Deleted ${messageDelete.length} messages for client ${user.email}`);

          const notificationDelete = await sql`
               DELETE FROM "Notification" 
               WHERE "email" = ${user.email}
             `;
          console.log(`Deleted ${notificationDelete.length} notifications for client ${user.email}`);

          const aiReviewDelete = await sql`
               DELETE FROM "AIReview" 
               WHERE "email" = ${user.email}
             `;
          console.log(`Deleted ${aiReviewDelete.length} AI reviews for client ${user.email}`);

          // Delete daily messages that reference this user
          const dailyMessageDelete = await sql`
             DELETE FROM "DailyMessage" 
             WHERE "userId" = ${user.id}
           `;
          console.log(`Deleted ${dailyMessageDelete.length} daily messages for client ${user.email}`);

          // Get the client record first to get its ID
          const clientRecord = await sql`
               SELECT "id", "programId" FROM "Client" WHERE "email" = ${user.email} LIMIT 1
             `;

          if (clientRecord.length > 0) {
            const clientId = clientRecord[0].id;
            const programId = clientRecord[0].programId;

            // Delete client profile using the actual client ID
            const profileDelete = await sql`
                 DELETE FROM "ClientProfile" 
                 WHERE "clientId" = ${clientId}
               `;
            console.log(`Deleted ${profileDelete.length} client profiles for client ${user.email}`);

            // Now delete from Client table
            const clientDelete = await sql`
                 DELETE FROM "Client" 
                 WHERE "email" = ${user.email}
               `;
            console.log(`Deleted ${clientDelete.length} client records for client ${user.email}`);
          } else {
            console.log(`No client record found for user ${user.email}`);
          }
        }

        if (user.role === 'clinic_admin') {
          // For clinic admins, handle any admin-specific cleanup if needed
          console.log(`No specific cleanup needed for clinic admin ${user.email}`);

          // Delete daily messages that reference this user
          const dailyMessageDelete = await sql`
             DELETE FROM "DailyMessage" 
             WHERE "userId" = ${user.id}
           `;
          console.log(`Deleted ${dailyMessageDelete.length} daily messages for clinic admin ${user.email}`);
        }
      }

      // Handle clinic-level data that references the clinic
      console.log(`Cleaning up clinic-level data for clinic: ${clinicId}`);

      // Delete subscription tier records
      const subscriptionDelete = await sql`
         DELETE FROM "SubscriptionTier" 
         WHERE "clinicId" = ${clinicId}
       `;
      console.log(`Deleted ${subscriptionDelete.length} subscription tier records for clinic ${clinicId}`);

      // Delete subscription history records
      const subscriptionHistoryDelete = await sql`
         DELETE FROM "SubscriptionHistory" 
         WHERE "clinicId" = ${clinicId}
       `;
      console.log(`Deleted ${subscriptionHistoryDelete.length} subscription history records for clinic ${clinicId}`);

      // Before deleting programs, set programId to NULL in any remaining Client records
      // This handles cases where clients might still reference programs
      const clientProgramUpdate = await sql`
         UPDATE "Client" 
         SET "programId" = NULL 
         WHERE "clinic" = ${clinicId} AND "programId" IS NOT NULL
       `;
      console.log(`Updated ${clientProgramUpdate.length} client program references for clinic ${clinicId}`);

      // Now delete programs that reference this clinic
      const programDelete = await sql`
         DELETE FROM "Program" 
         WHERE "clinicId" = ${clinicId}
       `;
      console.log(`Deleted ${programDelete.length} programs for clinic ${clinicId}`);

      // Delete activities that reference this clinic
      const activityDelete = await sql`
         DELETE FROM "Activity" 
         WHERE "clinicId" = ${clinicId}
       `;
      console.log(`Deleted ${activityDelete.length} activities for clinic ${clinicId}`);

      // Final cleanup: Handle any remaining client records that might still reference this clinic
      // This ensures all foreign key constraints are satisfied
      console.log(`Performing final cleanup for any remaining client records...`);

      // Delete any remaining client profiles
      const remainingProfileDelete = await sql`
         DELETE FROM "ClientProfile" 
         WHERE "clientId" IN (
           SELECT "id" FROM "Client" WHERE "clinic" = ${clinicId}
         )
       `;
      console.log(`Deleted ${remainingProfileDelete.length} remaining client profiles for clinic ${clinicId}`);

      // Delete any remaining check-ins for clients
      const remainingCheckInDelete = await sql`
         DELETE FROM "CheckIn" 
         WHERE "email" IN (
           SELECT "email" FROM "Client" WHERE "clinic" = ${clinicId}
         )
       `;
      console.log(`Deleted ${remainingCheckInDelete.length} remaining check-ins for clinic ${clinicId}`);

      // Delete any remaining messages for clients
      const remainingMessageDelete = await sql`
         DELETE FROM "Message" 
         WHERE "sender" IN (
           SELECT "email" FROM "Client" WHERE "clinic" = ${clinicId}
         ) OR "receiver" IN (
           SELECT "email" FROM "Client" WHERE "clinic" = ${clinicId}
         )
       `;
      console.log(`Deleted ${remainingMessageDelete.length} remaining messages for clinic ${clinicId}`);

      // Delete any remaining notifications for clients
      const remainingNotificationDelete = await sql`
         DELETE FROM "Notification" 
         WHERE "email" IN (
           SELECT "email" FROM "Client" WHERE "clinic" = ${clinicId}
         )
       `;
      console.log(`Deleted ${remainingNotificationDelete.length} remaining notifications for clinic ${clinicId}`);

      // Delete any remaining AI reviews for clients
      const remainingAIReviewDelete = await sql`
         DELETE FROM "AIReview" 
         WHERE "email" IN (
           SELECT "email" FROM "Client" WHERE "clinic" = ${clinicId}
         )
       `;
      console.log(`Deleted ${remainingAIReviewDelete.length} remaining AI reviews for clinic ${clinicId}`);

      // Finally, delete all remaining client records
      const remainingClientDelete = await sql`
         DELETE FROM "Client" 
         WHERE "clinic" = ${clinicId}
       `;
      console.log(`Deleted ${remainingClientDelete.length} remaining client records for clinic ${clinicId}`);

      // Now delete all users from the clinic
      const userDelete = await sql`
         DELETE FROM "User" WHERE "clinic" = ${clinicId}
       `;
      console.log(`Deleted ${userDelete.length} users from clinic ${clinicId}`);

      console.log(`Successfully completed deletion of clinic members for clinic: ${clinicId}`);
      return true;
    });
  } catch (error) {
    console.error('Error deleting clinic members:', error);
    throw error;
  }
}
