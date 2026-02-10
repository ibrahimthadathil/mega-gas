
"use client"

import React, { useState } from 'react';
import { Plus, Trash2, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Group } from '@/types/inventory';

interface GroupManagerProps {
  type: 'Warehouse' | 'Product';
  groups: Group[];
  availableItems: { id: string; name: string }[];
  onGroupsUpdate: (groups: Group[]) => void;
}

export function GroupManager({ type, groups, availableItems, onGroupsUpdate }: GroupManagerProps) {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup: Group = {
      id: Math.random().toString(36).substr(2, 9),
      name: newGroupName,
      memberIds: selectedItems,
    };
    onGroupsUpdate([...groups, newGroup]);
    setNewGroupName('');
    setSelectedItems([]);
  };

  const handleDeleteGroup = (id: string) => {
    onGroupsUpdate(groups.filter(g => g.id !== id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 w-full justify-start font-normal h-10 border-dashed">
          <Settings2 className="h-4 w-4" />
          Manage {type} Groups
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage {type} Groups</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4 overflow-hidden">
          <div className="space-y-4 flex flex-col h-full overflow-hidden">
            <div className="flex gap-2">
              <Input
                placeholder="Group name (e.g. North Region)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
              <Button onClick={handleCreateGroup} disabled={!newGroupName || selectedItems.length === 0}>
                <Plus className="h-4 w-4 mr-1" /> Create
              </Button>
            </div>

            <div className="border rounded-md p-4 space-y-2 max-h-[300px] overflow-y-auto">
              <Label className="text-sm font-medium mb-2 block">Select members for new group:</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems([...selectedItems, item.id]);
                        } else {
                          setSelectedItems(selectedItems.filter(id => id !== item.id));
                        }
                      }}
                    />
                    <label htmlFor={`item-${item.id}`} className="text-sm cursor-pointer truncate">
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto">
              <Label className="text-sm font-medium">Existing Groups:</Label>
              {groups.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-8 border-2 border-dashed rounded-md">
                  No groups created yet.
                </div>
              )}
              <div className="grid gap-2">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{group.name}</span>
                      <div className="flex flex-wrap gap-1">
                        {group.memberIds.map(mId => {
                          const name = availableItems.find(ai => ai.id === mId)?.name || 'Unknown';
                          return (
                            <Badge key={mId} variant="secondary" className="text-[10px] py-0">
                              {name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteGroup(group.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
