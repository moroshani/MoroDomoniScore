package com.morodomino.android.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        QuickGameSessionEntity::class,
        QuickGameSideEntity::class,
        QuickGameRoundEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class DominoyarDatabase : RoomDatabase() {
    abstract fun quickGameDao(): QuickGameDao

    companion object {
        @Volatile
        private var instance: DominoyarDatabase? = null

        fun getInstance(context: Context): DominoyarDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    DominoyarDatabase::class.java,
                    "dominoyar.db"
                ).build().also { instance = it }
            }
        }
    }
}
