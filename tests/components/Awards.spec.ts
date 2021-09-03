
import {createLocalVue, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import Awards from '../../src/components/Awards.vue';
import Award from '../../src/components/Award.vue';
import {FundedAwardModel} from '../../src/models/FundedAwardModel';
import {AWARD_COSTS} from '../../src/constants';

function getLocalVue() {
  const localVue = createLocalVue();
  localVue.directive('trim-whitespace', {});
  localVue.directive('i18n', {});
  return localVue;
}

function createAward({id = 1, funded = false}): FundedAwardModel {
  return {
    award: {
      name: `Award ${id} name`,
      description: `Award ${id} description`,
      getScore: () => 0,
    },
    player_name: funded ? 'Foo' : '',
    player_color: funded ? 'red': '',
    scores: [],
  };
}

const PreferencesManagerWithLernerModeOn = {
  loadBoolean: () => true,
};

describe('Awards', () => {
  it('shows passed awards', () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards},
    });

    wrapper.findAllComponents(Award).wrappers.forEach((awardWrapper, i) => {
      expect(awardWrapper.props('award')).to.be.deep.eq(awards[i]);
    });
  });

  it('hides awards on click', async () => {
    const awards = [
      createAward({id: 1, funded: true}),
      createAward({id: 2, funded: false}),
    ];

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {awards},
    });

    await wrapper.find('[data-test=toggle-awards]').trigger('click');

    expect(
      wrapper.findAllComponents(Award).wrappers.some((awardWrapper) => awardWrapper.isVisible()),
    ).to.be.false;
  });

  it('shows funded awards', () => {
    const fundedAward = createAward({id: 1, funded: true});
    const notFundedAward = createAward({id: 2, funded: false});

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [fundedAward, notFundedAward],
      },
    });

    const fundedAwards = wrapper.find('[data-test=funded-awards]');
    expect(fundedAwards.text()).to.include(fundedAward.award.name);
    expect(fundedAwards.text()).to.not.include(notFundedAward.award.name);

    const playerCube = fundedAwards.find(`[data-test-player-cube=${fundedAward.player_color}]`);
    expect(playerCube.exists()).to.be.true;
  });

  it('shows award spot prices if learner mode is on', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    expect(wrapper.find('[data-test=spot-price]').exists()).to.be.true;
  });

  it('shows correct spot prices if no awards are funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq(AWARD_COSTS);
  });

  it('shows correct spot prices if one award is funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq([AWARD_COSTS[1], AWARD_COSTS[2]]);
  });

  it('shows correct spot prices if two awards are funded', () => {
    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: true}),
          createAward({id: 3, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager: PreferencesManagerWithLernerModeOn};
      },
    });

    const prices = wrapper.findAll('[data-test=spot-price]')
      .wrappers.map((priceWrapper) => parseInt(priceWrapper.text()));

    expect(prices).to.be.deep.eq([AWARD_COSTS[2]]);
  });

  it('shows correct spot prices if three awards are funded', () => {
    const PreferencesManager = {
      loadBoolean: () => true,
    };

    const wrapper = shallowMount(Awards, {
      localVue: getLocalVue(),
      propsData: {
        awards: [
          createAward({id: 1, funded: true}),
          createAward({id: 2, funded: true}),
          createAward({id: 3, funded: true}),
          createAward({id: 4, funded: false}),
        ],
      },
      data() {
        return {PreferencesManager};
      },
    });

    expect(wrapper.find('[data-test=spot-price]').exists()).to.be.false;
  });
});
