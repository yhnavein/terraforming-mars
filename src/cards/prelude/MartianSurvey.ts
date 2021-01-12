import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class MartianSurvey extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.MARTIAN_SURVEY,
      tags: [Tags.SCIENCE],
      cost: 9,

      metadata: {
        cardNumber: 'P38',
        requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
        renderData: CardRenderer.builder((b) => {
          b.cards(2);
        }),
        description: 'Oxygen must be 4% or lower. Draw two cards.',
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player, game: Game): boolean {
    return game.checkMaxRequirements(player, GlobalParameter.OXYGEN, 4);
  }

  public play(player: Player) {
    player.drawCard(2);
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
