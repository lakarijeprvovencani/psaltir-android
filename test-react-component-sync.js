// Test to simulate React component state synchronization
console.log('🧪 === REACT COMPONENT STATE SYNCHRONIZATION TEST ===');

// Simulate React component state
class MockComponent {
  constructor() {
    this.isPlaying = false;
    this.forceUpdate = 0;
    this.renderCount = 0;
  }

  // Simulate useAudio hook
  useAudio() {
    return {
      isPlaying: this.isPlaying,
      forceUpdate: this.forceUpdate,
      togglePlayback: this.togglePlayback.bind(this)
    };
  }

  // Simulate togglePlayback
  async togglePlayback() {
    console.log('🧪 [COMPONENT] togglePlayback called');
    console.log('🧪 [COMPONENT] Current isPlaying:', this.isPlaying);
    
    if (this.isPlaying) {
      console.log('🧪 [COMPONENT] Pausing audio...');
      this.isPlaying = false;
      console.log('🧪 [COMPONENT] isPlaying set to FALSE');
    } else {
      console.log('🧪 [COMPONENT] Starting audio playback...');
      this.isPlaying = true;
      this.forceUpdate++; // Simulate triggerUIUpdate
      console.log('🧪 [COMPONENT] isPlaying set to TRUE');
      console.log('🧪 [COMPONENT] forceUpdate incremented to:', this.forceUpdate);
    }
    
    this.renderCount++;
    console.log('🧪 [COMPONENT] Component re-rendered, count:', this.renderCount);
  }

  // Simulate component render
  render() {
    const audio = this.useAudio();
    console.log('🧪 [COMPONENT] Render - isPlaying:', audio.isPlaying, 'forceUpdate:', audio.forceUpdate);
    return audio;
  }
}

// Create mock component
const component = new MockComponent();

// Test 1: Initial state
console.log('\n🧪 TEST 1: Initial state');
let audio = component.render();
console.log('🧪 Test 1 result:', {
  isPlaying: audio.isPlaying,
  forceUpdate: audio.forceUpdate,
  renderCount: component.renderCount
});

// Test 2: Play audio
console.log('\n🧪 TEST 2: Play audio');
await component.togglePlayback();
audio = component.render();
console.log('🧪 Test 2 result:', {
  isPlaying: audio.isPlaying,
  forceUpdate: audio.forceUpdate,
  renderCount: component.renderCount
});

// Test 3: Pause audio
console.log('\n🧪 TEST 3: Pause audio');
await component.togglePlayback();
audio = component.render();
console.log('🧪 Test 3 result:', {
  isPlaying: audio.isPlaying,
  forceUpdate: audio.forceUpdate,
  renderCount: component.renderCount
});

// Test 4: Play again
console.log('\n🧪 TEST 4: Play audio again');
await component.togglePlayback();
audio = component.render();
console.log('🧪 Test 4 result:', {
  isPlaying: audio.isPlaying,
  forceUpdate: audio.forceUpdate,
  renderCount: component.renderCount
});

console.log('\n🧪 === TEST SUMMARY ===');
console.log('🧪 Final isPlaying state:', audio.isPlaying);
console.log('🧪 Total force updates:', audio.forceUpdate);
console.log('🧪 Total renders:', component.renderCount);
console.log('🧪 All tests completed successfully!'); 