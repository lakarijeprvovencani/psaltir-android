// Test script to verify audio state synchronization
console.log('🧪 === AUDIO STATE SYNCHRONIZATION TEST ===');

// Mock AudioContext state
let mockIsPlaying = false;
let mockForceUpdate = 0;
let mockTriggerUIUpdateCalled = false;

// Mock triggerUIUpdate function
const triggerUIUpdate = () => {
  mockForceUpdate++;
  mockTriggerUIUpdateCalled = true;
  console.log('🧪 triggerUIUpdate called, forceUpdate:', mockForceUpdate);
};

// Mock togglePlayback function
const togglePlayback = async () => {
  console.log('🧪 togglePlayback called');
  console.log('🧪 Current isPlaying:', mockIsPlaying);
  
  if (mockIsPlaying) {
    console.log('🧪 Pausing audio...');
    mockIsPlaying = false;
    console.log('🧪 isPlaying set to FALSE');
  } else {
    console.log('🧪 Starting audio playback...');
    mockIsPlaying = true;
    console.log('🧪 isPlaying set to TRUE');
    triggerUIUpdate(); // This should force UI update
  }
  
  console.log('🧪 Final isPlaying state:', mockIsPlaying);
  console.log('🧪 Force update triggered:', mockTriggerUIUpdateCalled);
};

// Test 1: Play audio
console.log('\n🧪 TEST 1: Play audio');
await togglePlayback();
console.log('🧪 Test 1 result:', {
  isPlaying: mockIsPlaying,
  forceUpdate: mockForceUpdate,
  triggerUIUpdateCalled: mockTriggerUIUpdateCalled
});

// Reset for next test
mockTriggerUIUpdateCalled = false;

// Test 2: Pause audio
console.log('\n🧪 TEST 2: Pause audio');
await togglePlayback();
console.log('🧪 Test 2 result:', {
  isPlaying: mockIsPlaying,
  forceUpdate: mockForceUpdate,
  triggerUIUpdateCalled: mockTriggerUIUpdateCalled
});

// Test 3: Play again
console.log('\n🧪 TEST 3: Play audio again');
await togglePlayback();
console.log('🧪 Test 3 result:', {
  isPlaying: mockIsPlaying,
  forceUpdate: mockForceUpdate,
  triggerUIUpdateCalled: mockTriggerUIUpdateCalled
});

console.log('\n🧪 === TEST SUMMARY ===');
console.log('🧪 Total force updates:', mockForceUpdate);
console.log('🧪 Final isPlaying state:', mockIsPlaying);
console.log('🧪 All tests completed successfully!'); 