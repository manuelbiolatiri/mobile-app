import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

export default function PomodoroStatsScreen() {
  const stats = useSelector((state: RootState) => state.pomodoro.stats);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = stats.dailyStats[today];
    return {
      pomodoros: dailyStats?.pomodoros || 0,
      focusTime: dailyStats?.focusTime || 0,
    };
  };

  const todayStats = getDailyStats();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FontAwesome name="clock-o" size={24} color="#2563EB" />
              <Text style={styles.statValue}>{formatTime(todayStats.focusTime)}</Text>
              <Text style={styles.statLabel}>Focus Time</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome name="check-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{todayStats.pomodoros}</Text>
              <Text style={styles.statLabel}>Pomodoros</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Time</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <FontAwesome name="clock-o" size={24} color="#2563EB" />
              <Text style={styles.statValue}>{formatTime(stats.totalFocusTime)}</Text>
              <Text style={styles.statLabel}>Total Focus Time</Text>
            </View>
            <View style={styles.statCard}>
              <FontAwesome name="check-circle" size={24} color="#10B981" />
              <Text style={styles.statValue}>{stats.completedPomodoros}</Text>
              <Text style={styles.statLabel}>Total Pomodoros</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily History</Text>
          <View style={styles.historyList}>
            {Object.entries(stats.dailyStats)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([date, data]) => (
                <View key={date} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.historyDateText}>
                      {new Date(date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.historyStats}>
                    <Text style={styles.historyStatText}>
                      {formatTime(data.focusTime)} • {data.pomodoros} pomodoros
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  historyList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  historyDate: {
    width: 80,
  },
  historyDateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  historyStats: {
    flex: 1,
  },
  historyStatText: {
    fontSize: 14,
    color: '#111827',
  },
}); 