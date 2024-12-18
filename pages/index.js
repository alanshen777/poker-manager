import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const UNIT_BUYIN = {
  cash: 500,
  chips: 100000
};

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedUnits, setSelectedUnits] = useState(1);
  const [isAddBuyInOpen, setIsAddBuyInOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [addBuyInUnits, setAddBuyInUnits] = useState(1);

  // 获取可选的买入单位数（最多10个单位）
  const getBuyInUnitOptions = () => {
    return Array.from({length: 10}, (_, i) => i + 1);
  };

  // 添加新玩家
  const addPlayer = () => {
    if (!newPlayerName || !selectedUnits) return;
    
    const buyInAmount = {
      cash: UNIT_BUYIN.cash * selectedUnits,
      chips: UNIT_BUYIN.chips * selectedUnits
    };
    
    setPlayers([
      ...players,
      {
        id: Date.now(),
        name: newPlayerName,
        buyIns: [{
          units: selectedUnits,
          cash: buyInAmount.cash,
          chips: buyInAmount.chips,
          timestamp: new Date()
        }],
        totalUnits: selectedUnits,
        totalCash: buyInAmount.cash,
        totalChips: buyInAmount.chips
      }
    ]);
    setNewPlayerName('');
    setSelectedUnits(1);
  };

  // 追加买入
  const confirmAddBuyIn = () => {
    const buyInAmount = {
      cash: UNIT_BUYIN.cash * addBuyInUnits,
      chips: UNIT_BUYIN.chips * addBuyInUnits
    };
    
    setPlayers(players.map(player => {
      if (player.id === selectedPlayer.id) {
        return {
          ...player,
          buyIns: [...player.buyIns, {
            units: addBuyInUnits,
            cash: buyInAmount.cash,
            chips: buyInAmount.chips,
            timestamp: new Date()
          }],
          totalUnits: player.totalUnits + addBuyInUnits,
          totalCash: player.totalCash + buyInAmount.cash,
          totalChips: player.totalChips + buyInAmount.chips
        };
      }
      return player;
    }));

    setIsAddBuyInOpen(false);
    setSelectedPlayer(null);
    setAddBuyInUnits(1);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* 控制栏 */}
      <div className="flex justify-end items-center mb-8 gap-4">
        <input
          type="text"
          placeholder="新玩家名称"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="w-[200px] px-3 py-2 bg-gray-800 border rounded text-white"
        />
        <select 
          value={selectedUnits}
          onChange={(e) => setSelectedUnits(parseInt(e.target.value))}
          className="w-[200px] px-3 py-2 bg-gray-800 border rounded text-white"
        >
          {getBuyInUnitOptions().map(units => (
            <option key={units} value={units}>
              {units}个买入
            </option>
          ))}
        </select>
        <button 
          onClick={addPlayer} 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center"
        >
          <Plus className="w-6 h-6 mr-2" />
          添加买入
        </button>
      </div>

      {/* 玩家网格 */}
      <div className="grid grid-cols-5 gap-6">
        {players.map(player => (
          <div key={player.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="text-2xl font-bold mb-4 text-white">{player.name}</div>
            <div className="space-y-2">
              
              <div className="text-lg text-white">
              <span className="text-gray-500">买入手数:</span> &nbsp;&nbsp;<span className="text-green-400 text-3xl  font-bold mb-6">{player.totalUnits}</span>&nbsp;&nbsp;<span className="text-gray-500">手</span>
              </div>
              <div className="text-lg text-white">
                <span className="text-gray-500">买入次数:</span>&nbsp;&nbsp; <span className="text-gray-500">{player.buyIns.length}</span>
              </div>
            </div>
            <button 
              className="mt-4 w-full px-4 py-2 border border-gray-600 text-white hover:bg-gray-700 rounded-lg flex items-center justify-center"
              onClick={() => {
                setSelectedPlayer(player);
                setIsAddBuyInOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              追加买入
            </button>
          </div>
        ))}
      </div>

      {/* 追加买入对话框 */}
      {isAddBuyInOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">追加买入 - {selectedPlayer?.name}</h2>
            <select 
              value={addBuyInUnits}
              onChange={(e) => setAddBuyInUnits(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white mb-4"
            >
              {getBuyInUnitOptions().map(units => (
                <option key={units} value={units}>
                  {units}个买入
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsAddBuyInOpen(false)}
                className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700"
              >
                取消
              </button>
              <button 
                onClick={confirmAddBuyIn}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                确认买入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}